const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^(\+880|880|0)?1[3456789]\d{8}$/,
        "Please enter a valid Bangladeshi phone number",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "marketing_team", "order_manager", "product_manager"],
      default: "product_manager",
    },
    permissions: [
      {
        type: String,
        enum: [
          "products_read",
          "products_write",
          "products_delete",
          "orders_read",
          "orders_write",
          "orders_delete",
          "customers_read",
          "customers_write",
          "campaigns_read",
          "campaigns_write",
          "reports_read",
          "reports_write",
          "users_read",
          "users_write",
          "users_delete",
        ],
      },
    ],
    addresses: [
      {
        type: {
          type: String,
          enum: ["home", "office", "other"],
          default: "home",
        },
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
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    points: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/736x/b3/e7/22/b3e72259b6824955b078530d6b2df239.jpg",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};

// Add points method
userSchema.methods.addPoints = function (points) {
  this.points += points;
  return this.save();
};

// Get default address
userSchema.methods.getDefaultAddress = function () {
  return this.addresses.find((addr) => addr.isDefault) || this.addresses[0];
};

// Check permissions
userSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission) || this.role === "admin";
};

// Get role permissions
userSchema.methods.getRolePermissions = function () {
  const rolePermissions = {
    admin: [
      "products_read",
      "products_write",
      "products_delete",
      "orders_read",
      "orders_write",
      "orders_delete",
      "customers_read",
      "customers_write",
      "campaigns_read",
      "campaigns_write",
      "reports_read",
      "reports_write",
      "users_read",
      "users_write",
      "users_delete",
    ],
    marketing_team: ["campaigns_read", "campaigns_write", "reports_read"],
    order_manager: ["orders_read", "orders_write", "customers_read"],
    product_manager: ["products_read", "products_write", "reports_read"],
  };

  return rolePermissions[this.role] || [];
};

module.exports = mongoose.model("User", userSchema);
