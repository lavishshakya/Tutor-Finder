import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a hint for learning assistance
 * @param {string} question - The student's question
 * @returns {Promise<string>} - The AI-generated hint
 */
export const generateLearningHint = async (question) => {
  try {
    // Get the generative model - using gemini-2.5-flash for v1beta
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    // Create an intelligent context-aware prompt for learning assistance
    const prompt = `You are an intelligent learning assistant for students. Analyze the question type and respond appropriately:

**FOR MATHEMATICAL/PROBLEM-SOLVING/HIGH-THINKING QUESTIONS:**
- Provide strategic hints, NOT complete solutions
- Break down the problem into logical steps
- Ask guiding questions to stimulate critical thinking
- Point out key concepts or formulas they should consider
- Encourage them to work through it step-by-step
- Examples: "How do I solve quadratic equations?", "Help me understand calculus", "Explain recursion", "Solve this physics problem"

**FOR FACTUAL/DEFINITION/SHORT-ANSWER QUESTIONS:**
- Give direct, clear answers
- Provide concise explanations
- Include relevant examples if helpful
- Be straightforward and informative
- Examples: "What is photosynthesis?", "Define Newton's first law", "What is the capital of France?", "Who wrote Romeo and Juliet?", "What does DNA stand for?"

**General Guidelines:**
- Be encouraging and supportive
- Use emojis sparingly to keep it friendly 😊
- Keep responses concise (2-4 paragraphs max)
- If unclear, ask clarifying questions
- Always be educational and helpful

**Student's Question:** ${question}

**Your Response:**`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const hint = response.text();

    return hint;
  } catch (error) {
    console.error("Error generating hint with Gemini:", error);
    throw new Error("Failed to generate hint");
  }
};

/**
 * Generate a general AI response (for chat functionality)
 * @param {string} message - The user's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - The AI-generated response
 */
export const generateChatResponse = async (
  message,
  conversationHistory = []
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    // Build intelligent context from conversation history
    let contextPrompt = `You are an intelligent AI assistant for a tutor-finding platform. 

**Response Strategy - Adapt based on question type:**

1. **PROBLEM-SOLVING/MATHEMATICAL/ANALYTICAL QUESTIONS:**
   - Provide hints and strategic guidance
   - Break into logical steps
   - Ask guiding questions
   - Don't give complete solutions
   
2. **FACTUAL/DEFINITION/SHORT-ANSWER QUESTIONS:**
   - Give direct, clear answers
   - Provide concise explanations
   - Be straightforward
   
3. **PLATFORM-RELATED QUESTIONS:**
   - Help with tutor finding
   - Navigation assistance
   - Feature explanations

Be friendly, concise, and educational. Use emojis sparingly 😊
    
    `;

    // Add conversation history for context
    if (conversationHistory.length > 0) {
      contextPrompt += "Previous conversation:\n";
      conversationHistory.slice(-5).forEach((msg) => {
        contextPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${
          msg.content
        }\n`;
      });
      contextPrompt += "\n";
    }

    contextPrompt += `Current user message: ${message}\n\nYour response:`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating chat response with Gemini:", error);
    throw new Error("Failed to generate response");
  }
};

export { genAI };
