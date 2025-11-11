import express from "express";
import {
  getHint,
  chat,
  getStatus,
} from "../controllers/aiAssistantController.js";

const router = express.Router();

// POST /api/ai-assistant/hint - Get a learning hint for a student's question
router.post("/hint", getHint);

// POST /api/ai-assistant/chat - General chat with AI assistant
router.post("/chat", chat);

// GET /api/ai-assistant/status - Check AI assistant status
router.get("/status", getStatus);

export default router;
