// Add favorite functionality
export const toggleFavoriteTutor = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const parentId = req.user.id;
    
    // Validate the tutor exists and is actually a tutor
    const tutor = await User.findOne({ _id: tutorId, role: 'tutor' });
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }
    
    // Find the parent
    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }
    
    // Check if tutor is already a favorite
    const isFavorite = parent.favoriteTutors.includes(tutorId);
    
    if (isFavorite) {
      // Remove from favorites
      await User.findByIdAndUpdate(parentId, {
        $pull: { favoriteTutors: tutorId }
      });
    } else {
      // Add to favorites
      await User.findByIdAndUpdate(parentId, {
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
    });
  }
};

// Get favorite tutors
export const getFavoriteTutors = async (req, res) => {
  try {
    const parentId = req.user.id;
    
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
    });
  }
};

// Check if a tutor is favorited
export const checkFavoriteTutor = async (req, res) => {
  try {
    const tutorId = req.params.id;
    const parentId = req.user.id;
    
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