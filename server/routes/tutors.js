// Add this route to your tutors routes file:

// Get a single tutor by ID
router.get('/:id', async (req, res) => {
  try {
    const tutorId = req.params.id;
    
    // Find the tutor by ID
    const tutor = await User.findById(tutorId).select('-password');
    
    if (!tutor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tutor not found' 
      });
    }
    
    // Return the tutor data
    return res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (error) {
    console.error('Error getting tutor:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching tutor data',
      error: error.message 
    });
  }
});