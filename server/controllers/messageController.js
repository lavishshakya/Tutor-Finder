import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get all conversations for the current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all messages where current user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    }).sort({ createdAt: -1 });

    // Extract unique conversation IDs
    const conversationIds = [...new Set(messages.map(msg => msg.conversationId))];

    // For each conversation, get the latest message and the other participant's info
    const conversations = [];
    
    for (const conversationId of conversationIds) {
      // Get latest message in the conversation
      const latestMessage = await Message.findOne({ conversationId })
        .sort({ createdAt: -1 });
      
      // Get the other participant's ID from the conversation ID
      const participants = conversationId.split('_');
      const otherUserId = participants[0] === userId.toString() ? participants[1] : participants[0];
      
      // Get user info for the other participant
      const otherUser = await User.findById(otherUserId)
        .select('name profilePicture email role');
      
      if (!otherUser) continue; // Skip if user not found
      
      // Count unread messages where current user is recipient
      const unreadCount = await Message.countDocuments({
        conversationId,
        recipient: userId,
        read: false
      });
      
      conversations.push({
        id: conversationId,
        otherUser: {
          id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          profilePicture: otherUser.profilePicture,
          role: otherUser.role
        },
        unreadCount,
        lastMessage: latestMessage.text,
        timestamp: latestMessage.createdAt
      });
    }
    
    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get messages for a specific conversation
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    // Verify that the user is part of the conversation
    const participants = conversationId.split('_');
    if (!participants.includes(userId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this conversation'
      });
    }
    
    // Get all messages in the conversation
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });
    
    // Mark messages as read if current user is the recipient
    await Message.updateMany(
      { conversationId, recipient: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;
    const senderId = req.user.id;
    
    if (!recipientId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and message text are required'
      });
    }
    
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }
    
    // Create conversationId (sort IDs to ensure consistency)
    const participants = [senderId, recipientId].sort();
    const conversationId = participants.join('_');
    
    // Create and save the new message
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      conversationId,
      text,
      read: false
    });
    
    await newMessage.save();
    
    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    // Update all unread messages where user is recipient
    const result = await Message.updateMany(
      { conversationId, recipient: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        updated: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Clear all messages from a conversation
export const clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    
    // Verify that the user is part of the conversation
    const participants = conversationId.split('_');
    if (!participants.includes(userId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete messages from this conversation'
      });
    }
    
    console.log(`User ${userId} clearing conversation ${conversationId}`);
    
    // Delete all messages in the conversation
    const result = await Message.deleteMany({ conversationId });
    
    res.status(200).json({
      success: true,
      message: 'Conversation cleared successfully',
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};