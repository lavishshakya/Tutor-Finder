import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { 
  toggleFavoriteTutor, 
  getFavoriteTutors, 
  checkFavoriteTutor 
} from '../controllers/parentController.js';

const router = Router();

// Protected routes for parents
router.post('/toggle-favorite/:id', protect, authorize('parent'), toggleFavoriteTutor);
router.get('/favorite-tutors', protect, authorize('parent'), getFavoriteTutors);
router.get('/check-favorite/:id', protect, authorize('parent'), checkFavoriteTutor);

export default router;