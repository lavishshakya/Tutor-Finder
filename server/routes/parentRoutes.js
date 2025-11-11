<<<<<<< HEAD
import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { 
  toggleFavoriteTutor, 
  getFavoriteTutors, 
  checkFavoriteTutor 
} from '../controllers/parentController.js';
=======
import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  toggleFavoriteTutor,
  getFavoriteTutors,
  checkFavoriteTutor,
  updateParentProfile,
} from "../controllers/parentController.js";
>>>>>>> 181f83f (Updated Features)

const router = Router();

// Protected routes for parents
<<<<<<< HEAD
router.post('/toggle-favorite/:id', protect, authorize('parent'), toggleFavoriteTutor);
router.get('/favorite-tutors', protect, authorize('parent'), getFavoriteTutors);
router.get('/check-favorite/:id', protect, authorize('parent'), checkFavoriteTutor);

export default router;
=======
router.post(
  "/toggle-favorite/:id",
  protect,
  authorize("parent"),
  toggleFavoriteTutor
);
router.get("/favorite-tutors", protect, authorize("parent"), getFavoriteTutors);
router.get(
  "/check-favorite/:id",
  protect,
  authorize("parent"),
  checkFavoriteTutor
);
router.put(
  "/update-profile",
  protect,
  authorize("parent"),
  updateParentProfile
);

export default router;
>>>>>>> 181f83f (Updated Features)
