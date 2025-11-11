import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaTimes, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../services/api";

const ChatInterface = ({
  activeTutor,
  onClose,
  initialConversationId = null,
}) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [error, setError] = useState(null);
  const [clearingChat, setClearingChat] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const notificationSoundRef = useRef(null);

  // Initialize notification sound
  useEffect(() => {
    // Create a simple notification sound (you can replace with a custom sound file)
    notificationSoundRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGGS56+ibUBELTKXh8LVmHgU4jtXyzn0vBSV+zO/bljwGE1ap5+6jWRYLRpzd8L1xJAUqf8rx2Yo4BxdjuOnnm1ERC0mi4O+0Zh4FN4vT8M59LgUlfcvv25Y8BhJWqOXvo1sYC0Sa3O+8cSUFKn7K8diKOQcXY7jn5ptQEQtJod/us2YdBTaK0u/OfiUEJHzJ79yWOwYSVqbk7qNaGAtEmd3wxXInBSl9yO/YijkHFmK45+SbUBELSKDd77JlHQU1ic/vzn4mBCR8yO/blTsGElal5O6jWhgMRJjb8MV0KQUpfcjv2Io5BxZiuOXjm1ARDEef3O+yZRwFNYjO7s59JgQkfMnv25U7BhJWpOTuo1oYDESY2/DFdCkFKX7I79uLOgYWYrjk45pPEAxHnt3vs2YdBTaJzu7OfSYEJH3J7t2WPAYSVqPj7qJaGAxEmNnwxnUqBSh9x+7aijkHFmK54uOaTxAMR53b77NmHgU2ic7uzn0mBCR9ye3dlTsGElaj4+6iWhgMRJfY8MZ1KgUofcfv2Yk6BhZjueLjmk8QDEec2+6zZR4FNYnN7s19JgQkfsnt3JY7BhNWoePuoloYDUSW2PCfCjUGE1ah4u6jWhgMRJfY77xxJAUqfsfu2Yo5BxVjuOLim04QC0eb2++0ZR0FNYnN7sx+JgQlf8rt3JU7BhNVoePuolsYDUOW1+/GdSkGKH7I7tmJOgYVY7nh45tQEAtGmtvvsWUeBTSIze/MfiYFJH/K7tyVOwYTVaHi7qNbGA1DltfvxnUpBih+x+/ZiToGFWO54eObUBALRpra77BlHgUziM3uzH4mBSR/yu7ckzwGE1Wg4u6jWxgNQ5bX78Z1KgUofsfu2Io6BhVjuOPjm1AQC0aa2u+wZR4FMojN7sx9JgUkf8ru3JM8BhNVoOLuo1sYDUOW1+/GdSoFKH/H7tiKOgYVY7jj45tQEAtFmtrvsGUeBTKIze7MfSYFJH/K7tyTPAYTVaDi7qNbGQxDltfvxnUpBSh/x+7Yiz"
    );
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  // Load messages when component mounts or when activeTutor changes
  useEffect(() => {
    if (!currentUser || !activeTutor) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");

        }

        // If we don't have a conversation ID yet, we need to determine it
        // In our backend, conversation IDs are created by sorting and joining user IDs
        const participants = [currentUser.id, activeTutor._id].sort();
        const potentialConversationId = participants.join("_");

        // Try to fetch existing conversation
        const response = await axios.get(
          getApiUrl(`/api/messages/conversations/${potentialConversationId}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Format messages for our UI
          const loadedMessages = response.data.data.map((msg) => ({

            id: msg._id,
            senderId: msg.sender,
            text: msg.text,
            timestamp: new Date(msg.createdAt),
            read: msg.read,
          }));

          setMessages(loadedMessages);
          setConversationId(potentialConversationId);

          // Update the last message ID for polling
          if (loadedMessages.length > 0) {
            lastMessageIdRef.current =
              loadedMessages[loadedMessages.length - 1].id;
          }
        }
      } catch (error) {
        setError("Failed to load messages. Please try again.");


        // Even if there's an error fetching messages, we still want to set the conversation ID
        // so that we can send messages to start a new conversation
        if (!conversationId && currentUser && activeTutor) {
          const participants = [currentUser.id, activeTutor._id].sort();
          setConversationId(participants.join("_"));

        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser, activeTutor, initialConversationId]);

  // Real-time polling for new messages
  useEffect(() => {
    if (!currentUser || !activeTutor || !conversationId || loading) {
      return;
    }

    const pollForNewMessages = async () => {
      if (isPolling) return; // Prevent overlapping polls

      try {
        setIsPolling(true);

        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          getApiUrl(`/api/messages/conversations/${conversationId}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const loadedMessages = response.data.data.map((msg) => ({
            id: msg._id,
            senderId: msg.sender,
            text: msg.text,
            timestamp: new Date(msg.createdAt),
            read: msg.read,
          }));

          // Only update if there are new messages
          if (loadedMessages.length > messages.length) {
            const newMessages = loadedMessages.slice(messages.length);

            // Check if new messages are actually new (not from current user sending)
            const hasNewMessagesFromOther = newMessages.some(
              (msg) => msg.senderId !== currentUser.id
            );

            if (
              hasNewMessagesFromOther ||
              loadedMessages.length !== messages.length
            ) {
              setMessages(loadedMessages);
              lastMessageIdRef.current =
                loadedMessages[loadedMessages.length - 1]?.id;

              // Play notification sound for new messages from other user
              if (hasNewMessagesFromOther && notificationSoundRef.current) {
                notificationSoundRef.current.play().catch(() => {
                  // Silently fail if sound can't play (browser restrictions)
                });
              }
            }
          }
        }
      } catch (error) {
        // Silently fail for polling errors to avoid annoying the user
      } finally {
        setIsPolling(false);
      }
    };

    // Start polling every 3 seconds
    pollingIntervalRef.current = setInterval(pollForNewMessages, 3000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [
    currentUser,
    activeTutor,
    conversationId,
    loading,
    messages.length,
    isPolling,
  ]);

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || !currentUser || !activeTutor) return;

    try {
      setSending(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");

      }

      // Create a temporary message for optimistic UI update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        senderId: currentUser.id,
        text: message.trim(),
        timestamp: new Date(),
        pending: true,
      };

      // Add to UI immediately for better UX
      setMessages((prev) => [...prev, tempMessage]);

      // Clear the input
      setMessage("");

      // Determine recipient ID based on user role
      const recipientId = activeTutor._id;

      // Send to server
      const response = await axios.post(
        getApiUrl("/api/messages"),
        {
          recipientId,
          text: tempMessage.text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Replace the temp message with the confirmed one from server
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id

              ? {
                  id: response.data.data._id,
                  senderId: response.data.data.sender,
                  text: response.data.data.text,
                  timestamp: new Date(response.data.data.createdAt),
                  read: false,
                }
              : msg
          )
        );


        // If this is the first message, set the conversation ID
        if (!conversationId) {
          setConversationId(response.data.data.conversationId);
        }
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");

      // Mark the temporary message as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id.startsWith("temp-")
            ? { ...msg, failed: true, pending: false }

            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  // Handle clearing the chat conversation
  const handleClearChat = async () => {
    if (!conversationId || !currentUser) return;

    try {
      setClearingChat(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log(`Attempting to clear conversation: ${conversationId}`);

      const response = await axios.delete(
        getApiUrl(`/api/messages/conversations/${conversationId}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.data.success) {
        // Clear messages in the UI
        setMessages([]);
        // Add a system message to indicate chat was cleared
        setMessages([
          {
            id: "system-cleared",
            senderId: "system",
            text: "Chat history has been cleared.",
            timestamp: new Date(),
            read: true,
            isSystemMessage: true,
          },
        ]);

        // Hide the confirmation dialog
        setShowClearConfirm(false);
      } else {
        throw new Error("Failed to clear chat history");
      }
    } catch (error) {
      setError("Failed to clear chat history. Please try again.");

    } finally {
      setClearingChat(false);
    }
  };

  // Format date/time for messages
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now - 86400000).toDateString() === date.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          {activeTutor && (
            <>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mr-3 ring-2 ring-white/30 shadow-lg">
                {activeTutor.profilePicture ? (
                  <img
                    src={activeTutor.profilePicture}
                    alt={activeTutor.name}

                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {activeTutor.name
                      ? activeTutor.name.charAt(0).toUpperCase()
                      : "?"}

                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{activeTutor.name}</h3>
                <p className="text-xs text-indigo-100">
                  {activeTutor.subjects?.slice(0, 2).join(", ")}
                  {activeTutor.subjects?.length > 2 ? "..." : ""}
                </p>
                {/* Real-time connection indicator */}
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                      !isPolling
                        ? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50"
                        : "bg-yellow-400"
                    }`}
                  ></span>
                  <span className="text-xs text-white font-medium">
                    {!isPolling ? "Live" : "Syncing..."}
                  </span>
                </div>

              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Clear Chat Button */}
          {messages.length > 0 && !loading && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-white/90 hover:text-red-300 transition-all hover:scale-110 p-2 rounded-lg hover:bg-white/10"

              title="Clear chat history"
              disabled={clearingChat}
            >
              <FaTrash size={14} />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white transition-all hover:scale-110 p-2 rounded-lg hover:bg-white/10"
            aria-label="Close chat"
          >
            <FaTimes size={18} />
          </button>
        </div>
      </div>


      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">
              Are you sure you want to clear all chat history?
            </p>
            <p className="text-sm text-gray-600 mb-3">
              This action cannot be undone and will delete all messages from the
              database.

            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                disabled={clearingChat}
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center justify-center"
                disabled={clearingChat}
              >
                {clearingChat ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <FaTrash size={12} className="mr-2" />
                    <span>Clear All</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white"
        style={{ minHeight: "300px", maxHeight: "400px" }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-3 text-gray-500 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center">
              <p className="font-medium">{error}</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPaperPlane className="text-indigo-600 text-3xl" />
              </div>
              <p className="text-gray-600 font-medium text-lg mb-2">
                No messages yet
              </p>
              <p className="text-gray-400 text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isSystemMessage
                    ? "justify-center"
                    : message.senderId === currentUser?.id
                    ? "justify-end"
                    : "justify-start"
                } animate-fadeIn`}
              >
                {message.isSystemMessage ? (
                  // System message (like "chat cleared")
                  <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs italic shadow-sm">

                    {message.text}
                  </div>
                ) : (
                  // Regular user message
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md ${
                      message.senderId === currentUser?.id
                        ? `bg-gradient-to-br from-indigo-600 to-indigo-700 text-white ${
                            message.failed ? "opacity-70" : ""
                          }`
                        : "bg-white border border-gray-200 text-gray-800"

                    }`}
                  >
                    {message.pending && (
                      <div className="flex justify-end mb-1">
                        <span className="w-3 h-3 animate-spin rounded-full border-2 border-white border-t-transparent mr-1"></span>
                        <span className="text-xs text-indigo-200">
                          Sending...
                        </span>
                      </div>
                    )}

                    {message.failed && (
                      <div className="flex justify-end mb-1">
                        <span className="text-xs text-red-300">
                          Failed to send
                        </span>
                      </div>
                    )}

                    <p className="text-sm leading-relaxed">{message.text}</p>

                    <div className="mt-1.5 flex justify-end">
                      <p
                        className={`text-[10px] font-medium ${
                          message.senderId === currentUser?.id
                            ? "text-indigo-100"
                            : "text-gray-400"
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}

                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-4 py-4 bg-white border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex items-center space-x-2">

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"

            disabled={loading || sending}
          />
          <button
            type="submit"
            disabled={!message.trim() || sending || loading}
            className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 ${
              !message.trim() || sending || loading
                ? "opacity-50 cursor-not-allowed transform-none"
                : ""

            }`}
          >
            {sending ? (
              <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

