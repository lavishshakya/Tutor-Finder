import twilio from "twilio";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Validate phone number format (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid phone number format. Must be 10 digits starting with 6-9",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const formattedPhone = `+91${phoneNumber}`;

    // Store OTP with 5 minute expiry
    otpStore.set(phoneNumber, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
    });

    // Send SMS via Twilio
    try {
      const message = await twilioClient.messages.create({
        body: `Your Tutor Finder verification code is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });

      console.log("OTP sent successfully:", message.sid);

      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        messageSid: message.sid,
      });
    } catch (twilioError) {
      console.error("Twilio error:", twilioError);

      // Return specific error messages
      let errorMessage = "Failed to send OTP";
      if (twilioError.code === 21608) {
        errorMessage = "Phone number is not verified in Twilio trial account";
      } else if (twilioError.code === 21211) {
        errorMessage = "Invalid phone number";
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        error: twilioError.message,
      });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
      error: error.message,
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // Get stored OTP data
    const otpData = otpStore.get(phoneNumber);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new OTP",
      });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP",
      });
    }

    // Verify OTP
    if (otpData.otp === otp) {
      otpStore.delete(phoneNumber);
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      // Increment attempts
      otpData.attempts++;
      otpStore.set(phoneNumber, otpData);

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining`,
      });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
      error: error.message,
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Clear existing OTP
    otpStore.delete(phoneNumber);

    // Send new OTP (reuse sendOTP logic)
    return sendOTP(req, res);
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resending OTP",
      error: error.message,
    });
  }
};
