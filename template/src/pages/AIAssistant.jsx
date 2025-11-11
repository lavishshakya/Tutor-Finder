/**
 * AI Learning Assistant - Powered by Google Gemini
 *
 * This component provides an AI-powered learning assistant that gives students hints
 * rather than complete solutions, encouraging independent problem-solving.
 *
 * Integrated with Google Gemini API via backend for security
 */

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaPaperPlane,
  FaLightbulb,
  FaRobot,
  FaQuestionCircle,
} from "react-icons/fa";
import axios from "axios";

const AIAssistant = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content:
        "👋 Hi! I'm your AI Learning Assistant powered by Google Gemini.\n\n💡 **How I help you:**\n• For math/problem-solving questions → I give strategic hints\n• For facts/definitions → I give direct answers\n• For platform help → I guide you through features\n\nAsk me anything and I'll respond in the most helpful way!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI hint generator - calls backend API which uses Gemini
  const generateHint = async (question) => {
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await axios.post(`${API_URL}/api/ai-assistant/hint`, {
        question: question,
      });

      setIsLoading(false);

      if (response.data.success) {
        return response.data.hint;
      } else {
        throw new Error(response.data.error || "Failed to generate hint");
      }
    } catch (error) {
      console.error("Error getting hint from backend:", error);
      setIsLoading(false);

      // Fallback hint if API fails
      return "💡 Sorry, I'm having trouble connecting right now. Here's a general tip: Break down the problem into smaller steps. What do you already know? What are you trying to find? Try solving a simpler version first!";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Generate AI hint response
    const hint = await generateHint(inputMessage);

    const aiMessage = {
      type: "ai",
      content: hint,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const exampleQuestions = [
    "How do I solve x² - 5x + 6 = 0?",
    "What is photosynthesis?",
    "Help me understand recursion in programming",
    "Define Newton's first law",
  ];

  const handleExampleClick = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-16 pb-20 md:pt-20 md:pb-8">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 md:py-8">
        {/* Header - Compact on mobile */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg">
              <FaRobot className="text-white text-2xl sm:text-3xl md:text-4xl" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 px-2">
            AI Learning Assistant
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">
            Get hints and guidance to solve problems
          </p>
        </div>

        {/* Info Banner - Collapsible on mobile */}
        <div className="max-w-4xl mx-auto mb-3 sm:mb-4 md:mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-lg mx-2 sm:mx-0">
            <div className="flex items-start">
              <FaLightbulb className="text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1 text-sm sm:text-base">
                  How it works
                </h3>
                <p className="text-yellow-700 text-xs sm:text-sm">
                  Get <strong>hints and guidance</strong> instead of direct
                  answers!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container - Full height on mobile */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mx-2 sm:mx-0">
            {/* Messages Area - Dynamic height for mobile */}
            <div className="h-[calc(100vh-28rem)] sm:h-[450px] md:h-[500px] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white shadow-md border border-gray-200"
                    }`}
                  >
                    {message.type === "ai" && (
                      <div className="flex items-center mb-2">
                        <FaRobot className="text-indigo-600 mr-2 text-sm sm:text-base" />
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                          AI Assistant
                        </span>
                      </div>
                    )}
                    <p
                      className={`whitespace-pre-line text-sm sm:text-base ${
                        message.type === "ai" ? "text-gray-700" : "text-white"
                      }`}
                    >
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.type === "user"
                          ? "text-white/70"
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-md border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Example Questions - Scrollable on mobile */}
            {messages.length === 1 && (
              <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 flex items-center">
                  <FaQuestionCircle className="mr-2 flex-shrink-0" />
                  Try asking:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(question)}
                      className="text-left text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 p-2 sm:p-3 rounded-lg transition-colors active:scale-95 touch-manipulation"
                    >
                      "{question}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area - Optimized for mobile typing */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white border-t border-gray-200 sticky bottom-0"
            >
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-900 text-sm sm:text-base"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 touch-manipulation min-w-[60px] sm:min-w-auto"
                >
                  <FaPaperPlane className="text-sm sm:text-base sm:mr-2" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Features Section - Stack on mobile */}
        <div className="max-w-4xl mx-2 sm:mx-auto mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <div className="bg-indigo-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaLightbulb className="text-indigo-600 text-lg sm:text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">
              Hints Only
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Get helpful hints that guide you towards the solution without
              giving away the answer
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaRobot className="text-purple-600 text-lg sm:text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">
              24/7 Available
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Get instant help anytime you need it, day or night
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <div className="bg-pink-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaQuestionCircle className="text-pink-600 text-lg sm:text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">
              All Subjects
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Math, Science, Programming, and more - ask about any topic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
