import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const ReviewSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,

  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phoneNumber: {
      type: String,
      required: function () {
        // Phone not required for Google OAuth users initially
        return !this.googleId;
      },
      unique: true,
      sparse: true, // Allows null/empty values to be non-unique
      match: [/^[0-9]{10}$|^$/, "Please add a valid 10-digit phone number"],
    },
    password: {
      type: String,
      required: function () {
        // Password not required for Google OAuth users
        return !this.googleId;
      },
      select: false,
      validate: {
        validator: function (v) {
          // If googleId exists, password can be empty
          if (this.googleId) return true;
          // Otherwise, password must be at least 6 characters if provided
          return !v || v.length >= 6;
        },
        message: "Password must be at least 6 characters",
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to be non-unique
    },
    role: {
      type: String,
      enum: ["parent", "tutor"],
      default: "parent", // Add a default value
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Add or update these fields in your User schema:
    subjects: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: String,
      default: "",
    },
    // Change hourlyRate to monthlyRate for clarity
    monthlyRate: {
      type: Number,
      default: 0,
    },
    // Remove the old availability object structure
    // availability: {
    //   type: Object,
    //   default: { ... }
    // },
    // Add availableTimeSlots as a simple array
    availableTimeSlots: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    classes: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    reviews: [ReviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // New fields for tutor model
    // Phone and WhatsApp fields
    phoneNumber: {
      type: String,
      default: "", // Make it optional instead of required
    },
    whatsappNumber: {
      type: String,
      default: "", // Make it optional instead of required
    },
    // Tutor type preference
    tutorType: {
      type: String,
      enum: ["home", "center", "both"],
      default: "home",
    },
    // Local Tuition Center fields
    centerName: {
      type: String,
      default: "",
    },
    centerAddress: {
      type: String,
      default: "",
    },
    centerClasses: {
      type: [
        {
          day: String,
          time: String,
          subject: String,
          capacity: String,
        },
      ],
      default: [],
    },
    // Add favorites functionality for parents
    favoriteTutors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Payment related fields
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    registrationFeePaid: {
      type: Boolean,
      default: false,
    },
    paymentDetails: {
      orderId: String,
      paymentId: String,
      amount: Number,
      paidAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  // Skip password hashing for Google OAuth users (they don't have passwords)
  if (this.googleId && !this.password) {
    return next();
  }

  if (!this.isModified("password")) {
    next();
  }

  // Only hash if password exists and has length
  if (this.password && this.password.length > 0) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: process.env.JWT_EXPIRE || "30d" }

  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;

