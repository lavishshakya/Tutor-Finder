import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";

// Registration fee amount
const REGISTRATION_FEE = 100; // ₹100

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (amount !== REGISTRATION_FEE) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Registration fee is ₹100",
      });
    }

    // Check if user already paid
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.registrationFeePaid) {
      return res.status(400).json({
        success: false,
        message: "Registration fee already paid",
      });
    }

    // Generate short receipt ID (max 40 chars)
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const userIdShort = user._id.toString().slice(-8); // Last 8 chars of user ID
    const receiptId = `rcpt_${userIdShort}_${timestamp}`; // Will be ~25 chars

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise (₹100 = 10000 paise)
      currency: "INR",
      receipt: receiptId,
      notes: {
        userId: user._id.toString(),
        userName: user.name,
        userEmail: user.email,
        purpose: "Tutor Registration Fee",
      },
    };

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order.id);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    console.log("Payment verified:", payment);

    // Update user payment status
    const userId = payment.notes.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user record
    user.registrationFeePaid = true;
    user.paymentStatus = "completed";
    user.paymentDetails = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: payment.amount / 100, // Convert back to rupees
      currency: payment.currency,
      method: payment.method,
      paidAt: new Date(payment.created_at * 1000),
    };

    await user.save();

    console.log("User payment status updated:", user._id);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registrationFeePaid: user.registrationFeePaid,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "registrationFeePaid paymentStatus paymentDetails"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      paymentStatus: {
        paid: user.registrationFeePaid,
        status: user.paymentStatus,
        details: user.paymentDetails,
      },
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
      error: error.message,
    });
  }
};
