import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatInterface = ({ activeTutor, onClose, initialConversationId = null }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [error, setError] = useState(null);
  const [clearingChat, setClearingChat] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // If we don't have a conversation ID yet, we need to determine it
        // In our backend, conversation IDs are created by sorting and joining user IDs
        const participants = [currentUser.id, activeTutor._id].sort();
        const potentialConversationId = participants.join('_');
        
        console.log("Attempting to fetch messages with conversation ID:", potentialConversationId);
        
        // Try to fetch existing conversation
        const response = await axios.get(
          `http://localhost:5001/api/messages/conversations/${potentialConversationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log('Messages response:', response.data);
        
        if (response.data.success) {
          // Format messages for our UI
          const loadedMessages = response.data.data.map(msg => ({
            id: msg._id,
            senderId: msg.sender,
            text: msg.text,
            timestamp: new Date(msg.createdAt),
            read: msg.read
          }));
          
          setMessages(loadedMessages);
          setConversationId(potentialConversationId);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again.');
        
        // Even if there's an error fetching messages, we still want to set the conversation ID
        // so that we can send messages to start a new conversation
        if (!conversationId && currentUser && activeTutor) {
          const participants = [currentUser.id, activeTutor._id].sort();
          setConversationId(participants.join('_'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser, activeTutor, initialConversationId]);

  // Handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentUser || !activeTutor) return;
    
    try {
      setSending(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Create a temporary message for optimistic UI update
      const tempMessage = {
        id: `temp-${Date.now()}`,
        senderId: currentUser.id,
        text: message.trim(),
        timestamp: new Date(),
        pending: true
      };
      
      // Add to UI immediately for better UX
      setMessages(prev => [...prev, tempMessage]);
      
      // Clear the input
      setMessage('');
      
      // Determine recipient ID based on user role
      const recipientId = activeTutor._id;
      
      // Send to server
      const response = await axios.post(
        'http://localhost:5001/api/messages',
        { 
          recipientId, 
          text: tempMessage.text 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Message sent response:', response.data);
      
      if (response.data.success) {
        // Replace the temp message with the confirmed one from server
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? {
                  id: response.data.data._id,
                  senderId: response.data.data.sender,
                  text: response.data.data.text,
                  timestamp: new Date(response.data.data.createdAt),
                  read: false
                } 
              : msg
          )
        );
        
        // If this is the first message, set the conversation ID
        if (!conversationId) {
          setConversationId(response.data.data.conversationId);
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Mark the temporary message as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id.startsWith('temp-') 
            ? {...msg, failed: true, pending: false} 
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
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log(`Attempting to clear conversation: ${conversationId}`);
      
      const response = await axios.delete(
        `http://localhost:5001/api/messages/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Clear chat response:', response.data);
      
      if (response.data.success) {
        // Clear messages in the UI
        setMessages([]);
        // Add a system message to indicate chat was cleared
        setMessages([{
          id: 'system-cleared',
          senderId: 'system',
          text: 'Chat history has been cleared.',
          timestamp: new Date(),
          read: true,
          isSystemMessage: true
        }]);
        
        // Hide the confirmation dialog
        setShowClearConfirm(false);
      } else {
        throw new Error('Failed to clear chat history');
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      setError('Failed to clear chat history. Please try again.');
    } finally {
      setClearingChat(false);
    }
  };

  // Format date/time for messages
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          {activeTutor && (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center overflow-hidden mr-3">
                {activeTutor.profilePicture ? (
                  <img 
                    src={activeTutor.profilePicture} 
                    alt={activeTutor.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {activeTutor.name ? activeTutor.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{activeTutor.name}</h3>
                <p className="text-xs text-indigo-200">
                  {activeTutor.subjects?.slice(0, 2).join(', ')}
                  {activeTutor.subjects?.length > 2 ? '...' : ''}
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Clear Chat Button */}
          {messages.length > 0 && !loading && (
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="text-white hover:text-red-200 transition-colors"
              title="Clear chat history"
              disabled={clearingChat}
            >
              <FaTrash size={14} />
            </button>
          )}
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="text-white hover:text-indigo-200 transition-colors"
            aria-label="Close chat"
          >
            <FaTimes size={16} />
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
              This action cannot be undone and will delete all messages from the database.
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
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ minHeight: '300px', maxHeight: '400px' }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${
                  message.isSystemMessage ? 'justify-center' : 
                  message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.isSystemMessage ? (
                  // System message (like "chat cleared")
                  <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs italic">
                    {message.text}
                  </div>
                ) : (
                  // Regular user message
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.senderId === currentUser?.id 
                        ? `bg-indigo-600 text-white ${message.failed ? 'opacity-70' : ''}`
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {message.pending && (
                      <div className="flex justify-end mb-1">
                        <span className="w-3 h-3 animate-spin rounded-full border-2 border-white border-t-transparent mr-1"></span>
                        <span className="text-xs text-indigo-200">Sending...</span>
                      </div>
                    )}
                    
                    {message.failed && (
                      <div className="flex justify-end mb-1">
                        <span className="text-xs text-red-300">Failed to send</span>
                      </div>
                    )}
                    
                    <p className="text-sm">{message.text}</p>
                    
                    <div className="mt-1 flex justify-end">
                      <p 
                        className={`text-xs ${
                          message.senderId === currentUser?.id 
                            ? 'text-indigo-200' 
                            : 'text-gray-400'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                        {message.senderId === currentUser?.id && !message.pending && !message.failed && (
                          <span className="ml-2">
                            {message.read ? '• Read' : '• Sent'}
                          </span>
                        )}
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
      <div className="px-4 py-3 bg-white border-t">
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading || sending}
          />
          <button
            type="submit"
            disabled={!message.trim() || sending || loading}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md transition duration-200 flex items-center justify-center ${
              !message.trim() || sending || loading ? 'opacity-50 cursor-not-allowed' : ''
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