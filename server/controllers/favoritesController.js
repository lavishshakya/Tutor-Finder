import User from '../models/User.js';
import mongoose from 'mongoose';

// Get user's favorite tutors
export const getFavorites = async (req, res) => {
  try {
    console.log(`Getting favorites for user ${req.user.id}`);
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // If no favorites, return empty array
    if (!user.favorites || user.favorites.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // Populate favorites with tutor details
    const favoriteTutors = await User.find(
      { 
        _id: { $in: user.favorites },
        role: 'tutor'
      },
      'name email profilePicture bio qualifications subjects classes monthlyRate rating'
    );
    
    console.log(`Found ${favoriteTutors.length} favorite tutors`);
    
    res.status(200).json({
      success: true,
      count: favoriteTutors.length,
      data: favoriteTutors
    });
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add tutor to user's favorites
export const addToFavorites = async (req, res) => {
  try {
    const { tutorId } = req.body;
    
    // Input validation
    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: 'Tutor ID is required'
      });
    }
    
    // Validate tutorId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tutor ID format'
      });
    }
    
    console.log(`User ${req.user.id} attempting to add tutor ${tutorId} to favorites`);
    
    // Check if tutor exists
    const tutorExists = await User.findOne({ 
      _id: tutorId, 
      role: 'tutor' 
    });
    
    if (!tutorExists) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }
    
    // Check if tutor is already in favorites
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.favorites) {
      user.favorites = [];
    }
    
    // Convert to string for comparison
    const tutorIdStr = tutorId.toString();
    const favoritesStr = user.favorites.map(id => id.toString());
    
    if (favoritesStr.includes(tutorIdStr)) {
      return res.status(400).json({
        success: false,
        message: 'Tutor already in favorites'
      });
    }
    
    // Add to favorites
    user.favorites.push(tutorId);
    await user.save();
    
    console.log(`Tutor ${tutorId} added to favorites for user ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      message: 'Tutor added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Error adding tutor to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Remove tutor from user's favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { tutorId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tutor ID format'
      });
    }
    
    console.log(`User ${req.user.id} attempting to remove tutor ${tutorId} from favorites`);
    
    // Find user and remove from favorites
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.favorites) {
      user.favorites = [];
    }
    
    // Check if tutor is in favorites
    const tutorIdStr = tutorId.toString();
    const favoritesStr = user.favorites.map(id => id.toString());
    
    if (!favoritesStr.includes(tutorIdStr)) {
      return res.status(400).json({
        success: false,
        message: 'Tutor not in favorites'
      });
    }
    
    // Remove from favorites
    user.favorites = user.favorites.filter(
      favorite => favorite.toString() !== tutorIdStr
    );
    
    await user.save();
    
    console.log(`Tutor ${tutorId} removed from favorites for user ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      message: 'Tutor removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Error removing tutor from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};