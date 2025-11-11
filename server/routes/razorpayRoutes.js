import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentStatus,
} from "../controllers/razorpayController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create payment order
router.post("/create-order", protect, createOrder);

// Verify payment
router.post("/verify", protect, verifyPayment);

// Get payment status
router.get("/status", protect, getPaymentStatus);

export default router;
