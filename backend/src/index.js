import express from 'express';
import cors from 'cors';
import config from './config/default.js';
import { handleChat } from './controllers/chatController.js';
import openaiService from './services/openaiService.js';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Chatbot API is running',
    endpoints: {
      chat: '/api/chat',
      health: '/health'
    }
  });
});

// Handle OPTIONS requests
app.options('*', (req, res) => {
  res.status(204).end();
});

app.post('/api/chat', handleChat);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB
mongoose.connect(config.mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Validate OpenAI API key on startup
openaiService.validateApiKey()
  .then(isValid => {
    if (isValid) {
      console.log('OpenAI API key is valid');
    } else {
      console.error('Invalid OpenAI API key');
    }
  })
  .catch(error => {
    console.error('Error validating OpenAI API key:', error);
  });

// Start server
const PORT = config.port || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
