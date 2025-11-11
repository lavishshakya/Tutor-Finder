<<<<<<< HEAD
import { Router } from 'express';
import { 
  getAllTutors, 
  getTutorById, 
  updateTutorProfile, 
  getTutorProfile,
  addReview,
  getTutorReviews
} from '../controllers/tutorController.js';
import { protect, authorize } from '../middleware/auth.js';
=======
import { Router } from "express";
import {
  getAllTutors,
  getTutorById,
  updateTutorProfile,
  getTutorProfile,
  addReview,
  getTutorReviews,
  updateCenterInfo,
} from "../controllers/tutorController.js";
import { protect, authorize } from "../middleware/auth.js";
>>>>>>> 181f83f (Updated Features)

const router = Router();

// Protected routes - these must come BEFORE routes with path parameters
<<<<<<< HEAD
router.get('/my-profile', protect, authorize('tutor'), getTutorProfile);
router.put('/profile', protect, authorize('tutor'), updateTutorProfile);

// Public routes
router.get('/', getAllTutors);
router.get('/:id', getTutorById);
router.get('/:id/reviews', getTutorReviews);

// Review routes
router.post('/:id/reviews', protect, authorize('parent'), addReview);

export default router;
=======
router.get("/my-profile", protect, authorize("tutor"), getTutorProfile);
router.put("/profile", protect, authorize("tutor"), updateTutorProfile);
router.put("/center-info", protect, authorize("tutor"), updateCenterInfo);

// Public routes
router.get("/", getAllTutors);
router.get("/:id", getTutorById);
router.get("/:id/reviews", getTutorReviews);

// Review routes
router.post("/:id/reviews", protect, authorize("parent"), addReview);

export default router;
>>>>>>> 181f83f (Updated Features)
