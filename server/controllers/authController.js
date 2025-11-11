import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body); // Add this line
    const { name, email, phoneNumber, password, role, whatsappNumber } =
      req.body;
    console.log("Register request received:", {
      name,
      email,
      phoneNumber,
      role,
    });

    // Check if user already exists with email

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",

      });
    }

    // Create user with these fields if provided
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role,
      whatsappNumber: whatsappNumber || phoneNumber,

    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error details:", err); // Enhance this line
    res.status(500).json({
      success: false,
      message: err.message || "Server error during registration",

    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    console.log("Login request received:", { emailOrPhone });

    // Validate emailOrPhone & password
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email/phone and password",
      });
    }

    // Check if input is email or phone number
    const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
      emailOrPhone
    );
    const isPhone = /^[0-9]{10}$/.test(emailOrPhone);

    if (!isEmail && !isPhone) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email or 10-digit phone number",
      });
    }

    // Find user by email or phone number
    const query = isEmail
      ? { email: emailOrPhone }
      : { phoneNumber: emailOrPhone };
    const user = await User.findOne(query).select("+password");

    if (!user) {
      console.log("User not found with:", emailOrPhone);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",

      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password does not match for user:", emailOrPhone);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",

      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",

    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Google OAuth callback handler
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Check if this is a new user (incomplete registration)
    if (req.user.isNewUser) {
      // Redirect to profile setup page with Google data
      const googleData = encodeURIComponent(
        JSON.stringify(req.user.googleData)
      );
      res.redirect(`${frontendUrl}/oauth-complete?data=${googleData}`);
      return;
    }

    // Existing user - generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Redirect to frontend with token and user data
    const redirectUrl = `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        registrationFeePaid: req.user.registrationFeePaid,
      })
    )}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/login?error=auth_failed`
    );
  }
};

// @desc    Complete OAuth registration with additional info
// @route   POST /api/auth/oauth-complete
// @access  Public
export const completeOAuthRegistration = async (req, res) => {
  try {
    const {
      name,
      email,
      googleId,
      profilePicture,
      phoneNumber,
      role,
      whatsappNumber,
    } = req.body;

    console.log("Complete OAuth registration:", {
      name,
      email,
      phoneNumber,
      role,
    });

    // Validate required fields
    if (!name || !email || !googleId || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Create user with OAuth data
    const user = await User.create({
      name,
      email,
      googleId,
      profilePicture,
      phoneNumber,
      role,
      whatsappNumber: whatsappNumber || phoneNumber,
      password: "", // No password for OAuth users
      registrationFeePaid: role === "parent", // Parents don't pay, tutors need to pay
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registrationFeePaid: user.registrationFeePaid,
      },
    });
  } catch (error) {
    console.error("Complete OAuth registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

