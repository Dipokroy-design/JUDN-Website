const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      maxlength: [100, "Campaign name cannot exceed 100 characters"],
    },
    platform: {
      type: String,
      required: [true, "Platform is required"],
      enum: ["instagram", "facebook", "whatsapp", "tiktok", "youtube"],
    },
    goal: {
      type: String,
      required: [true, "Campaign goal is required"],
      enum: [
        "drive_clicks",
        "increase_awareness",
        "generate_leads",
        "boost_sales",
      ],
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "completed"],
      default: "draft",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, "Spent amount cannot be negative"],
    },
    metrics: {
      instagram_views: {
        type: Number,
        default: 0,
      },
      facebook_ad_clicks: {
        type: Number,
        default: 0,
      },
      whatsapp_clicks: {
        type: Number,
        default: 0,
      },
      total_impressions: {
        type: Number,
        default: 0,
      },
      total_clicks: {
        type: Number,
        default: 0,
      },
      conversion_rate: {
        type: Number,
        default: 0,
      },
    },
    performanceLogs: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        metrics: {
          instagram_views: Number,
          facebook_ad_clicks: Number,
          whatsapp_clicks: Number,
          total_impressions: Number,
          total_clicks: Number,
        },
        notes: String,
      },
    ],
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// Virtual for campaign duration
campaignSchema.virtual("duration").get(function () {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Virtual for campaign progress
campaignSchema.virtual("progress").get(function () {
  if (this.startDate && this.endDate) {
    const now = new Date();
    const totalDuration = this.endDate - this.startDate;
    const elapsed = now - this.startDate;
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  }
  return 0;
});

// Virtual for budget utilization
campaignSchema.virtual("budgetUtilization").get(function () {
  if (this.budget && this.budget > 0) {
    return (this.spent / this.budget) * 100;
  }
  return 0;
});

// Index for search
campaignSchema.index({
  name: "text",
  platform: "text",
  goal: "text",
  tags: "text",
});

// Static method to get active campaigns
campaignSchema.statics.getActive = function () {
  const now = new Date();
  return this.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
};

// Static method to get campaigns by platform
campaignSchema.statics.getByPlatform = function (platform) {
  return this.find({ platform });
};

// Static method to get campaign statistics
campaignSchema.statics.getCampaignStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$platform",
        count: { $sum: 1 },
        totalBudget: { $sum: "$budget" },
        totalSpent: { $sum: "$spent" },
        totalClicks: { $sum: "$metrics.total_clicks" },
        totalImpressions: { $sum: "$metrics.total_impressions" },
      },
    },
  ]);
};

module.exports = mongoose.model("Campaign", campaignSchema);
