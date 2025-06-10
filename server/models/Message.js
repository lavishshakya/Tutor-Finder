// filepath: c:\Users\Lavish Shakya\Desktop\Tutor Finder\server\models\Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index on sender and recipient to optimize queries
MessageSchema.index({ sender: 1, recipient: 1 });
// Create an index on conversationId for quick conversation lookups
MessageSchema.index({ conversationId: 1 });

// Generate conversation ID when saving new message
MessageSchema.pre('save', function(next) {
  if (!this.conversationId) {
    // Sort IDs to ensure consistent conversation IDs regardless of who sends first
    const participants = [this.sender.toString(), this.recipient.toString()].sort();
    this.conversationId = participants.join('_');
  }
  next();
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;