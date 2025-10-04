const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "judn-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact administrator.",
      });
    }

    if (user.isLocked()) {
      return res.status(401).json({
        success: false,
        message: "Account is locked. Please try again later.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
  }
};

// Middleware to check if user has specific permission
const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Middleware to check if user has specific role
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];

    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient role permissions.",
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

// Middleware to check if user is marketing team
const isMarketingTeam = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const allowedRoles = ["admin", "marketing_team"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Marketing team privileges required.",
    });
  }

  next();
};

// Middleware to check if user is order manager
const isOrderManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const allowedRoles = ["admin", "order_manager"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Order manager privileges required.",
    });
  }

  next();
};

// Middleware to check if user is product manager
const isProductManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const allowedRoles = ["admin", "product_manager"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Product manager privileges required.",
    });
  }

  next();
};

// Middleware to log user activity
const logActivity = (action) => {
  return (req, res, next) => {
    // Log the activity (you can implement this with a separate Activity model)
    console.log(
      `User ${req.user?.name} (${req.user?.role}) performed: ${action}`
    );
    next();
  };
};

module.exports = {
  isAuthenticated,
  hasPermission,
  hasRole,
  isAdmin,
  isMarketingTeam,
  isOrderManager,
  isProductManager,
  logActivity,
};
