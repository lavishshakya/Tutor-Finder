/**
 * AI Assistant Controller - Powered by Google Gemini
 *
 * This controller handles AI assistant requests using Google's Gemini API
 */

import {
  generateLearningHint,
  generateChatResponse,
} from "../config/gemini.js";

/**
 * @desc    Generate a learning hint for a student's question
 * @route   POST /api/ai-assistant/hint
 * @access  Public
 */
export const getHint = async (req, res) => {
  try {
    const { question } = req.body;

    // Validate input
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide a question",
      });
    }

    // Check question length
    if (question.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Question is too long. Please keep it under 1000 characters.",
      });
    }

    // Generate hint using Gemini AI
    const hint = await generateLearningHint(question);

    res.status(200).json({
      success: true,
      hint: hint,
      question: question,
    });
  } catch (error) {
    console.error("Error in getHint controller:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate hint. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Generate a chat response
 * @route   POST /api/ai-assistant/chat
 * @access  Public
 */
export const chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide a message",
      });
    }

    // Check message length
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        error: "Message is too long. Please keep it under 500 characters.",
      });
    }

    // Generate response using Gemini AI
    const response = await generateChatResponse(
      message,
      conversationHistory || []
    );

    res.status(200).json({
      success: true,
      response: response,
      message: message,
    });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate response. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * @desc    Check AI assistant status
 * @route   GET /api/ai-assistant/status
 * @access  Public
 */
export const getStatus = async (req, res) => {
  try {
    const isConfigured = !!process.env.GEMINI_API_KEY;

    res.status(200).json({
      success: true,
      status: isConfigured ? "active" : "not configured",
      message: isConfigured
        ? "AI Assistant is ready"
        : "Gemini API key not configured",
    });
  } catch (error) {
    console.error("Error checking AI status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check AI status",
    });
  }
};
