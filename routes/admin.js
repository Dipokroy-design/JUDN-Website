const express = require("express");
const {
  isAuthenticated,
  isAdmin,
  isMarketingTeam,
  isOrderManager,
  isProductManager,
} = require("../middleware/auth");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Campaign = require("../models/Campaign");

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(isAuthenticated);

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin, Marketing Team, Order Manager, Product Manager)
router.get("/dashboard/stats", async (req, res) => {
  try {
    const user = req.user;

    // Check permissions
    if (!user.hasPermission("reports_read") && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    // Get current date and date 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total sales
    const salesResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "packed", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
        },
      },
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get active campaigns
    const activeCampaigns = await Campaign.countDocuments({ status: "active" });

    // Get order status counts
    const orderStatusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderStatusCounts.forEach((status) => {
      if (statusCounts.hasOwnProperty(status._id)) {
        statusCounts[status._id] = status.count;
      }
    });

    // Get recent sales trend (last 30 days)
    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ["confirmed", "packed", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          dailySales: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get campaign statistics
    const campaignStats = await Campaign.aggregate([
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 },
          totalClicks: { $sum: "$metrics.total_clicks" },
          totalImpressions: { $sum: "$metrics.total_impressions" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalSales,
        totalProducts,
        activeCampaigns,
        orderStatusCounts: statusCounts,
        salesTrend,
        campaignStats,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
});

// @route   GET /api/admin/dashboard/sales-trends
// @desc    Get sales trends data
// @access  Private (Admin, Marketing Team, Order Manager, Product Manager)
router.get("/dashboard/sales-trends", async (req, res) => {
  try {
    const { period = 30 } = req.query;
    const days = parseInt(period);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ["confirmed", "packed", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          dailySales: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format data for chart
    const labels = [];
    const values = [];

    // Fill in missing dates with 0
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const existingData = salesTrend.find((item) => item._id === dateStr);

      labels.push(
        currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
      values.push(existingData ? existingData.dailySales : 0);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: {
        labels,
        values,
      },
    });
  } catch (error) {
    console.error("Sales trends error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales trends",
    });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products
// @access  Private (Admin, Product Manager)
router.get("/products", isProductManager, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (status !== undefined) {
      query.availabilityToggle = status === "active";
    }

    const products = await Product.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

// @route   POST /api/admin/products
// @desc    Create a new product
// @access  Private (Admin, Product Manager)
router.post("/products", isProductManager, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update a product
// @access  Private (Admin, Product Manager)
router.put("/products/:id", isProductManager, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete a product
// @access  Private (Admin, Product Manager)
router.delete("/products/:id", isProductManager, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private (Admin, Order Manager)
router.get("/orders", isOrderManager, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

// @route   GET /api/admin/orders/recent
// @desc    Get recent orders
// @access  Private (Admin, Order Manager)
router.get("/orders/recent", isOrderManager, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get recent orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin, Order Manager)
router.put("/orders/:id/status", isOrderManager, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedBy: req.user._id,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            updatedBy: req.user._id,
            notes,
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
});

// @route   GET /api/admin/customers
// @desc    Get all customers
// @access  Private (Admin, Order Manager)
router.get("/customers", isOrderManager, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, platform, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (platform) {
      query.platform = platform;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      data: customers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
});

// @route   POST /api/admin/customers
// @desc    Create a new customer
// @access  Private (Admin, Order Manager)
router.post("/customers", isOrderManager, async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create customer",
    });
  }
});

// @route   GET /api/admin/campaigns
// @desc    Get all campaigns
// @access  Private (Admin, Marketing Team)
router.get("/campaigns", isMarketingTeam, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, platform } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (platform) {
      query.platform = platform;
    }

    const campaigns = await Campaign.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Campaign.countDocuments(query);

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
    });
  }
});

// @route   POST /api/admin/campaigns
// @desc    Create a new campaign
// @access  Private (Admin, Marketing Team)
router.post("/campaigns", isMarketingTeam, async (req, res) => {
  try {
    const campaignData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: campaign,
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create campaign",
    });
  }
});

// @route   PUT /api/admin/campaigns/:id
// @desc    Update a campaign
// @access  Private (Admin, Marketing Team)
router.put("/campaigns/:id", isMarketingTeam, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      message: "Campaign updated successfully",
      data: campaign,
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update campaign",
    });
  }
});

// @route   PUT /api/admin/campaigns/:id/metrics
// @desc    Update campaign metrics
// @access  Private (Admin, Marketing Team)
router.put("/campaigns/:id/metrics", isMarketingTeam, async (req, res) => {
  try {
    const { metrics } = req.body;

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      {
        $set: { metrics },
        $push: {
          performanceLogs: {
            date: new Date(),
            metrics,
            notes: req.body.notes || "",
          },
        },
      },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      message: "Campaign metrics updated successfully",
      data: campaign,
    });
  } catch (error) {
    console.error("Update campaign metrics error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update campaign metrics",
    });
  }
});

module.exports = router;
