const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["shirts", "pants", "dresses", "accessories", "shoes", "bags"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sizeOptions: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      },
    ],
    fabricMaterial: {
      type: String,
      trim: true,
    },
    colors: [
      {
        name: String,
        hexCode: String,
      },
    ],
    inventoryStockLevel: {
      type: Number,
      required: [true, "Stock level is required"],
      min: [0, "Stock level cannot be negative"],
      default: 0,
    },
    availabilityToggle: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      unique: true,
      required: [true, "SKU is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingInfo: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      shippingClass: {
        type: String,
        enum: ["standard", "express", "premium"],
        default: "standard",
      },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    salePercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
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

// Generate SKU if not provided
productSchema.pre("save", function (next) {
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.sku = `JUDN-${timestamp}-${random}`;
  }
  next();
});

// Virtual for sale price
productSchema.virtual("salePrice").get(function () {
  if (this.isOnSale && this.salePercentage) {
    return this.price - (this.price * this.salePercentage) / 100;
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.inventoryStockLevel === 0) return "out_of_stock";
  if (this.inventoryStockLevel <= 10) return "low_stock";
  return "in_stock";
});

// Index for search
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  brand: "text",
});

// Static method to get products by category
productSchema.statics.getByCategory = function (category) {
  return this.find({ category, availabilityToggle: true });
};

// Static method to get featured products
productSchema.statics.getFeatured = function () {
  return this.find({ isFeatured: true, availabilityToggle: true });
};

// Static method to get new products
productSchema.statics.getNew = function () {
  return this.find({ isNew: true, availabilityToggle: true });
};

// Static method to get sale products
productSchema.statics.getOnSale = function () {
  return this.find({ isOnSale: true, availabilityToggle: true });
};

module.exports = mongoose.model("Product", productSchema);
