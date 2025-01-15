import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

// Update lastMessageAt timestamp when new messages are added
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastMessageAt = new Date();
  }
  next();
});

// Method to add a new message to the chat
chatSchema.methods.addMessage = function(role, content) {
  this.messages.push({ role, content });
  return this.save();
};

// Method to get chat history in OpenAI format
chatSchema.methods.getOpenAIHistory = function() {
  return this.messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
