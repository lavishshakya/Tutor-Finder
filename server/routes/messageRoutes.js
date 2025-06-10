import { Router } from 'express';
import { 
  getConversations, 
  getConversationMessages, 
  sendMessage,
  markAsRead,
  clearConversation
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Get all conversations for the current user
router.get('/conversations', getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId', getConversationMessages);

// Send a new message
router.post('/', sendMessage);

// Mark messages as read
router.put('/conversations/:conversationId/read', markAsRead);

// Clear all messages from a conversation
router.delete('/conversations/:conversationId', clearConversation);

export default router;