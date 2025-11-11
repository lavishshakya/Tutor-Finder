<<<<<<< HEAD
=======
import User from "../models/User.js";

>>>>>>> 181f83f (Updated Features)
// Add favorite functionality
export const toggleFavoriteTutor = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const parentId = req.user.id;
<<<<<<< HEAD
    
    // Validate the tutor exists and is actually a tutor
    const tutor = await User.findOne({ _id: tutorId, role: 'tutor' });
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }
    
=======

    // Validate the tutor exists and is actually a tutor
    const tutor = await User.findOne({ _id: tutorId, role: "tutor" });
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

>>>>>>> 181f83f (Updated Features)
    // Find the parent
    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
<<<<<<< HEAD
        message: 'Parent not found'
      });
    }
    
    // Check if tutor is already a favorite
    const isFavorite = parent.favoriteTutors.includes(tutorId);
    
    if (isFavorite) {
      // Remove from favorites
      await User.findByIdAndUpdate(parentId, {
        $pull: { favoriteTutors: tutorId }
=======
        message: "Parent not found",
      });
    }

    // Check if tutor is already a favorite
    const isFavorite = parent.favoriteTutors.includes(tutorId);

    if (isFavorite) {
      // Remove from favorites
      await User.findByIdAndUpdate(parentId, {
        $pull: { favoriteTutors: tutorId },
>>>>>>> 181f83f (Updated Features)
      });
    } else {
      // Add to favorites
      await User.findByIdAndUpdate(parentId, {
<<<<<<< HEAD
        $addToSet: { favoriteTutors: tutorId }
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        isFavorite: !isFavorite
      },
      message: isFavorite ? 'Tutor removed from favorites' : 'Tutor added to favorites'
    });
  } catch (error) {
    console.error('Error toggling favorite tutor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
=======
        $addToSet: { favoriteTutors: tutorId },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        isFavorite: !isFavorite,
      },
      message: isFavorite
        ? "Tutor removed from favorites"
        : "Tutor added to favorites",
    });
  } catch (error) {
    console.error("Error toggling favorite tutor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
>>>>>>> 181f83f (Updated Features)
    });
  }
};

// Get favorite tutors
export const getFavoriteTutors = async (req, res) => {
  try {
    const parentId = req.user.id;
<<<<<<< HEAD
    
    const parent = await User.findById(parentId).populate('favoriteTutors', 'name profilePicture subjects qualifications');
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: parent.favoriteTutors
    });
  } catch (error) {
    console.error('Error getting favorite tutors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
=======

    const parent = await User.findById(parentId).populate(
      "favoriteTutors",
      "name profilePicture subjects qualifications"
    );

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: parent.favoriteTutors,
    });
  } catch (error) {
    console.error("Error getting favorite tutors:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
>>>>>>> 181f83f (Updated Features)
    });
  }
};

// Check if a tutor is favorited
export const checkFavoriteTutor = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const parentId = req.user.id;
<<<<<<< HEAD
    
    const parent = await User.findById(parentId);
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }
    
    const isFavorite = parent.favoriteTutors.includes(tutorId);
    
    return res.status(200).json({
      success: true,
      data: { isFavorite }
    });
  } catch (error) {
    console.error('Error checking favorite tutor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
=======

    const parent = await User.findById(parentId);

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    const isFavorite = parent.favoriteTutors.includes(tutorId);

    return res.status(200).json({
      success: true,
      data: { isFavorite },
    });
  } catch (error) {
    console.error("Error checking favorite tutor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update parent profile
export const updateParentProfile = async (req, res) => {
  try {
    const { name, whatsappNumber, profilePicture } = req.body;
    const parentId = req.user.id;

    // Find the parent
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "parent") {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    // Update fields
    if (name) parent.name = name;
    if (whatsappNumber !== undefined)
      parent.whatsappNumber = whatsappNumber || parent.phoneNumber;
    if (profilePicture) parent.profilePicture = profilePicture;

    await parent.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: parent.name,
        email: parent.email,
        phoneNumber: parent.phoneNumber,
        whatsappNumber: parent.whatsappNumber,
        profilePicture: parent.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating parent profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
>>>>>>> 181f83f (Updated Features)
