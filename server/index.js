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

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

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
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});