<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js'; // Import tutorRoutes
import parentRoutes from './routes/parentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js'; // Import favoritesRoutes
=======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import passportConfig from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js"; // Import tutorRoutes
import parentRoutes from "./routes/parentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js"; // Import favoritesRoutes
import aiAssistantRoutes from "./routes/aiAssistantRoutes.js"; // Import AI assistant routes
import otpRoutes from "./routes/otpRoutes.js"; // Import OTP routes
import razorpayRoutes from "./routes/razorpayRoutes.js"; // Import Razorpay routes
>>>>>>> 181f83f (Updated Features)

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

<<<<<<< HEAD
// Middleware - ORDER MATTERS HERE
app.use(express.json()); // Must come before routes
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.181.194:5173'
    ];
    
    // For development, allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('CORS blocked origin:', origin);
      // During development, you might want to allow all origins
      // return callback(null, true);
    }
    
    return callback(null, true); // Allow all origins for now
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add debugging middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('Headers:', req.headers);
  }
  next();
});

// Test endpoint to debug request body
app.post('/test', (req, res) => {
  console.log('Request Body:', req.body);
  res.json({ received: req.body });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes); // Add this line for tutorRoutes
app.use('/api/parents', parentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoritesRoutes); // Add this line for favoritesRoutes

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
=======
// Passport configuration
passportConfig(passport);

// Middleware - ORDER MATTERS HERE
app.use(express.json()); // Must come before routes
app.use(cookieParser());

// Session middleware for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://192.168.181.194:5173",
      ];

      // For development, allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        // During development, you might want to allow all origins
        // return callback(null, true);
      }

      return callback(null, true); // Allow all origins for now
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tutors", tutorRoutes); // Add this line for tutorRoutes
app.use("/api/parents", parentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/favorites", favoritesRoutes); // Add this line for favoritesRoutes
app.use("/api/ai-assistant", aiAssistantRoutes); // Add AI assistant routes
app.use("/api/otp", otpRoutes); // Add OTP routes
app.use("/api/razorpay", razorpayRoutes); // Add Razorpay routes

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
>>>>>>> 181f83f (Updated Features)
});

// Error handling middleware
app.use((err, req, res, next) => {
<<<<<<< HEAD
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
=======
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Server Error",
>>>>>>> 181f83f (Updated Features)
  });
});

const PORT = process.env.PORT || 5001;

<<<<<<< HEAD
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
=======
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> 181f83f (Updated Features)
