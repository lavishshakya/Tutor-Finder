<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
=======
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
>>>>>>> 181f83f (Updated Features)

dotenv.config();

// Protect routes - improved error handling
export const protect = async (req, res, next) => {
  try {
    let token;
<<<<<<< HEAD
    
    // Get token from authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Using token from Authorization header');
    } 
    // Get token from cookie (alternative method)
    else if (req.cookies?.token) {
      token = req.cookies.token;
      console.log('Using token from cookies');
    }
    
    // Make sure token exists
    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    try {
      // Verify token and log the process
      console.log('Verifying JWT token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      console.log('JWT verified successfully. User ID:', decoded.id);
      
      // Find the user in database with error checking
      console.log('Looking up user in database...');
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found in database for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // User found, attach to request
      console.log('User authenticated:', user.name, '(Role:', user.role, ')');
=======

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
>>>>>>> 181f83f (Updated Features)
      req.user = user;
      next();
    } catch (err) {
      // Specific error handling for JWT verification
<<<<<<< HEAD
      if (err.name === 'JsonWebTokenError') {
        console.log('Invalid token signature:', err.message);
        return res.status(401).json({
          success: false,
          message: 'Invalid token signature'
        });
      } else if (err.name === 'TokenExpiredError') {
        console.log('Token has expired');
        return res.status(401).json({
          success: false,
          message: 'Token has expired, please log in again'
        });
      } else {
        console.log('Token verification error:', err.message);
        return res.status(401).json({
          success: false,
          message: 'Token verification failed'
=======
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
>>>>>>> 181f83f (Updated Features)
        });
      }
    }
  } catch (error) {
<<<<<<< HEAD
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
=======
    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
>>>>>>> 181f83f (Updated Features)
    });
  }
};

<<<<<<< HEAD
// Grant access to specific roles - with improved error logging
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Authorization failed: No user object on request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log(`Authorization failed: User role ${req.user.role} not in allowed roles [${roles}]`);
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    
    console.log(`User authorized with role: ${req.user.role}`);
    next();
  };
};
=======
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
>>>>>>> 181f83f (Updated Features)
