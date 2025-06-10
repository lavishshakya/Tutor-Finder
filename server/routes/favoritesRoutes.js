import { Router } from 'express';
import { 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites 
} from '../controllers/favoritesController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Get all favorites
router.get('/', getFavorites);

// Add to favorites
router.post('/', addToFavorites);

// Remove from favorites
router.delete('/:tutorId', removeFromFavorites);

export default router;