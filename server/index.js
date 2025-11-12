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

// Load environment variables
dotenv.config();

const app = express();

// Connect to database (lazy connection for serverless)
let isConnected = false;
const ensureDBConnection = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await ensureDBConnection();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

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
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cross-site cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://192.168.181.194:5173",
  "https://tutor-finder-kvwb.vercel.app", // Production frontend
  "https://tutor-finder-kvwb-5s0pqh1im-lavishshakyas-projects.vercel.app", // Preview deployment
  process.env.FRONTEND_URL, // Additional frontend URL from env
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or matches Vercel preview pattern
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        return callback(null, true);
      }

      // In production, be strict. In development, allow all
      if (process.env.NODE_ENV === "production") {
        return callback(new Error("Not allowed by CORS"));
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
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
  res.json({ 
    success: true, 
    message: "Tutor Finder API is running",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    status: "healthy",
    database: isConnected ? "connected" : "disconnected"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5001;

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
