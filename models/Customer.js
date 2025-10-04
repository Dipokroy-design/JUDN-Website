const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [50, "Customer name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [
        /^(\+880|880|0)?1[3456789]\d{8}$/,
        "Please enter a valid Bangladeshi phone number",
      ],
    },
    email: {
      type: String,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    interest: {
      type: String,
      enum: [
        "shirts",
        "pants",
        "dresses",
        "accessories",
        "shoes",
        "bags",
        "general",
      ],
      default: "general",
    },
    platform: {
      type: String,
      enum: [
        "facebook",
        "instagram",
        "whatsapp",
        "website",
        "referral",
        "other",
      ],
      required: [true, "Platform is required"],
    },
    status: {
      type: String,
      enum: ["lead", "customer", "inactive", "blocked"],
      default: "lead",
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["home", "office", "other"],
          default: "home",
        },
        street: String,
        city: String,
        state: String,
        postalCode: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    preferences: {
      size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      },
      color: String,
      style: String,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    lastOrderDate: Date,
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
    followUpNotes: String,
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    source: {
      type: String,
      enum: ["organic", "paid_ad", "referral", "social_media", "direct"],
      default: "organic",
    },
    leadScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    communicationHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          enum: ["call", "message", "email", "whatsapp"],
        },
        notes: String,
        outcome: {
          type: String,
          enum: ["positive", "neutral", "negative"],
        },
      },
    ],
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

// Index for search
customerSchema.index({
  name: "text",
  phone: "text",
  email: "text",
  notes: "text",
  tags: "text",
});

// Virtual for customer value
customerSchema.virtual("customerValue").get(function () {
  if (this.totalOrders > 0) {
    return this.totalSpent / this.totalOrders;
  }
  return 0;
});

// Virtual for customer lifetime
customerSchema.virtual("customerLifetime").get(function () {
  if (this.lastOrderDate) {
    const diffTime = Math.abs(new Date() - this.lastOrderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Static method to get customers by status
customerSchema.statics.getByStatus = function (status) {
  return this.find({ status });
};

// Static method to get customers by platform
customerSchema.statics.getByPlatform = function (platform) {
  return this.find({ platform });
};

// Static method to get customers requiring follow-up
customerSchema.statics.getFollowUpRequired = function () {
  return this.find({
    followUpRequired: true,
    followUpDate: { $lte: new Date() },
  });
};

// Static method to get top customers
customerSchema.statics.getTopCustomers = function (limit = 10) {
  return this.find({ status: "customer" })
    .sort({ totalSpent: -1 })
    .limit(limit);
};

// Static method to get customer statistics
customerSchema.statics.getCustomerStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalSpent: { $sum: "$totalSpent" },
        avgSpent: { $avg: "$totalSpent" },
      },
    },
  ]);
};

// Static method to get customers by date range
customerSchema.statics.getByDateRange = function (startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });
};

module.exports = mongoose.model("Customer", customerSchema);
