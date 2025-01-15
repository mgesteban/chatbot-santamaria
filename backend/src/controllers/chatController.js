import openaiService from '../services/openaiService.js';

export const handleChat = async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const { message } = req.body;
    
    if (!message) {
      console.log('No message provided in request');
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format messages for the OpenAI service
    const messages = [{
      role: 'user',
      content: message,
      userId: req.userId || 'default' // Use authenticated user ID if available
    }];

    // Get response from OpenAI
    console.log('Calling OpenAI service with messages:', messages);
    const response = await openaiService.generateChatResponse(messages);
    console.log('OpenAI service response:', response);

    if (!response.success) {
      console.error('OpenAI service error:', response.error);
      throw new Error(response.error || 'Failed to generate response');
    }

    // Send response back to client
    const responseData = {
      message: response.response,
      threadId: response.threadId
    };
    console.log('Sending response to client:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Chat Controller Error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error.message
    });
  }
};
