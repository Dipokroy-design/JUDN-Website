const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
      },
      phone: {
        type: String,
        required: [true, "Customer phone is required"],
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
      },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: String,
        color: String,
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "packed",
            "shipped",
            "delivered",
            "cancelled",
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        notes: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: [
        "bkash",
        "nagad",
        "visa",
        "mastercard",
        "paypal",
        "cash_on_delivery",
      ],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      transactionId: String,
      paymentDate: Date,
      amount: Number,
    },
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      phone: String,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "premium"],
      default: "standard",
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    notes: {
      customer: String,
      admin: String,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    pointsRedeemed: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Generate order ID
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.orderId = `JUDN-${timestamp}-${random}`;
  }
  next();
});

// Calculate totals
orderSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.total = this.subtotal + this.tax + this.shipping - this.discount;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.updatedBy,
    });
  }
  next();
});

// Virtual for order summary
orderSchema.virtual("orderSummary").get(function () {
  return {
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    totalValue: this.total,
    status: this.status,
    orderDate: this.createdAt,
  };
});

// Static method to get orders by status
orderSchema.statics.getByStatus = function (status) {
  return this.find({ status }).populate("items.product");
};

// Static method to get orders by date range
orderSchema.statics.getByDateRange = function (startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("items.product");
};

// Static method to get total sales
orderSchema.statics.getTotalSales = function (startDate, endDate) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  }
  matchStage.status = { $in: ["confirmed", "packed", "shipped", "delivered"] };

  return this.aggregate([
    { $match: matchStage },
    { $group: { _id: null, totalSales: { $sum: "$total" } } },
  ]);
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalValue: { $sum: "$total" },
      },
    },
  ]);
};

module.exports = mongoose.model("Order", orderSchema);
