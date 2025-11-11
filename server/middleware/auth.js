import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";


dotenv.config();

// Protect routes - improved error handling
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Get token from cookie (alternative method)
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key"
      );

      // Find the user in database
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // User found, attach to request

      req.user = user;
      next();
    } catch (err) {
      // Specific error handling for JWT verification
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token signature",
        });
      } else if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired, please log in again",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Token verification failed",

        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in authentication",

    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

