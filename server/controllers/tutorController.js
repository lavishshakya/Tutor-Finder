import User from "../models/User.js";


// Get all tutors
export const getAllTutors = async (req, res) => {
  try {
    // Only fetch tutors who have paid registration fee (subscribed)
    const tutors = await User.find({
      role: "tutor",
      registrationFeePaid: true,
    })
      .select("-password -createdAt -updatedAt")
      .lean();

    res.status(200).json({
      success: true,
      count: tutors.length,
      data: tutors,
    });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({
      success: false,
      message: "Server error",

    });
  }
};

// Get tutor's own profile (protected)
export const getTutorProfile = async (req, res) => {
  try {
    console.log("Getting tutor profile for user ID:", req.user.id);

    const tutor = await User.findById(req.user.id).select("-password");

    if (!tutor) {
      console.log("No tutor found for ID:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    if (tutor.role !== "tutor") {
      console.log("User is not a tutor:", req.user.id);
      return res.status(403).json({
        success: false,
        message: "User is not a tutor",
      });
    }

    console.log("Tutor profile found:", tutor.name);

    res.status(200).json({
      success: true,
      data: tutor,
    });
  } catch (error) {
    console.error("Error in getTutorProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,

    });
  }
};

// Update tutor profile (protected)
export const updateTutorProfile = async (req, res) => {
  try {
    console.log("Update tutor profile request for user ID:", req.user.id);
    console.log("Update data:", req.body);

    const allowedFields = [
      "bio",
      "qualifications",
      "subjects",
      "classes",
      "location",
      "monthlyRate",
      "phoneNumber",
      "whatsappNumber",
      "availableTimeSlots",
      "profilePicture",
      "tutorType",
      "centerName",
      "centerAddress",
      "centerClasses",
    ];

    // Create an object with only the fields that are allowed to be updated
    const updateData = {};
    allowedFields.forEach((field) => {

      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    console.log("Sanitized update data:", updateData);

    console.log("Sanitized update data:", updateData);

    // Add profileCompleted flag
    updateData.profileCompleted = true;


    const updatedTutor = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedTutor) {
      console.log("No tutor found to update for ID:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    console.log("Tutor profile updated successfully");

    res.status(200).json({
      success: true,
      data: updatedTutor,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateTutorProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,

    });
  }
};

// Add a review to a tutor
export const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const tutorId = req.params.id;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid rating between 1-5",

      });
    }

    // Find the tutor
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== "tutor") {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",

      });
    }

    // Check if user is trying to review themselves
    if (req.user.id === tutorId) {
      return res.status(400).json({
        success: false,
        message: "You cannot review yourself",

      });
    }

    // Check if parent has already submitted a review for this tutor
    const existingReviewIndex = tutor.reviews.findIndex(
      (r) => r.parent.toString() === req.user.id

    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      tutor.reviews[existingReviewIndex].rating = rating;
      tutor.reviews[existingReviewIndex].review = review || "";

      tutor.reviews[existingReviewIndex].date = Date.now();
    } else {
      // Add new review
      tutor.reviews.push({
        parent: req.user.id,
        rating,
        review: review || "",

      });
      tutor.reviewCount += 1;
    }

    // Calculate new average rating
    const totalRating = tutor.reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    tutor.rating = totalRating / tutor.reviews.length;

    await tutor.save();

    res.status(200).json({
      success: true,
      data: {
        rating: tutor.rating,
        reviewCount: tutor.reviewCount,
      },
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Server error",

    });
  }
};

// Get reviews for a tutor
export const getTutorReviews = async (req, res) => {
  try {
    const tutorId = req.params.id;

    const tutor = await User.findById(tutorId).populate({
      path: "reviews.parent",
      select: "name profilePicture",
    });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    const reviews = tutor.reviews.map((review) => ({

      id: review._id,
      parentName: review.parent.name,
      parentProfilePicture: review.parent.profilePicture,
      rating: review.rating,
      review: review.review,
      date: review.date,
    }));

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({
      success: false,
      message: "Server error",

    });
  }
};

// Get tutor by ID - public endpoint
export const getTutorById = async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tutor ID format",
      });
    }

    const tutor = await User.findById(req.params.id).select("-password");

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    if (tutor.role !== "tutor") {
      return res.status(400).json({
        success: false,
        message: "User is not a tutor",
      });
    }

    // Check if tutor has paid registration fee
    if (!tutor.registrationFeePaid) {
      return res.status(403).json({
        success: false,
        message: "Tutor profile is not available. Registration fee not paid.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tutor,
    });
  } catch (error) {
    console.error("Error getting tutor by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update tuition center information (protected)
export const updateCenterInfo = async (req, res) => {
  try {
    console.log("Update center info request for user ID:", req.user.id);
    console.log("Center data:", req.body);

    const { centerName, centerAddress, centerClasses } = req.body;

    const updateData = {
      centerName: centerName || "",
      centerAddress: centerAddress || "",
      centerClasses: centerClasses || [],
    };

    const updatedTutor = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedTutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    if (updatedTutor.role !== "tutor") {
      return res.status(403).json({
        success: false,
        message: "User is not a tutor",
      });
    }

    console.log("Center info updated successfully for:", updatedTutor.name);

    res.status(200).json({
      success: true,
      message: "Tuition center information updated successfully",
      data: updatedTutor,
    });
  } catch (error) {
    console.error("Error updating center info:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

