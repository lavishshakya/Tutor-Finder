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


const router = Router();

// Protected routes - these must come BEFORE routes with path parameters
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

