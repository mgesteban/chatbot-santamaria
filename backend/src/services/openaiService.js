import OpenAI from 'openai';
import config from '../config/default.js';

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey
    });
    this.threads = new Map(); // Store threads for conversation persistence
  }

  async generateChatResponse(messages) {
    try {
      const userId = messages[0]?.userId || 'default'; // Use a user identifier if available
      let threadId = this.threads.get(userId);
      let thread;

      // Create or retrieve a thread
      if (!threadId) {
        thread = await this.openai.beta.threads.create();
        threadId = thread.id;
        this.threads.set(userId, threadId);
      }

      // Add the user's message to the thread
      await this.openai.beta.threads.messages.create(
        threadId,
        {
          role: "user",
          content: messages[messages.length - 1].content
        }
      );

      // Create a run with the assistant
      const run = await this.openai.beta.threads.runs.create(
        threadId,
        {
          assistant_id: config.openai.assistantId,
          instructions: "Please provide helpful and accurate responses based on the trained data."
        }
      );

      // Poll for the run to complete
      let runStatus = await this.openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );

      // Wait for run to complete
      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(
          threadId,
          run.id
        );

        if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error(`Run ended with status: ${runStatus.status}`);
        }
      }

      // Retrieve the messages added by the assistant
      const messages_list = await this.openai.beta.threads.messages.list(
        threadId
      );

      // Get the last message from the assistant
      const assistantMessage = messages_list.data
        .filter(message => message.role === 'assistant')[0];

      if (!assistantMessage) {
        throw new Error('No response from assistant');
      }

      return {
        success: true,
        response: assistantMessage.content[0].text.value,
        threadId: threadId
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Method to validate API key on service initialization
  async validateApiKey() {
    try {
      await this.openai.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI API Key Validation Error:', error);
      return false;
    }
  }

  // Method to moderate content before sending to OpenAI
  async moderateContent(content) {
    try {
      const moderation = await this.openai.moderations.create({
        input: content
      });

      return {
        success: true,
        flagged: moderation.results[0].flagged,
        categories: moderation.results[0].categories
      };
    } catch (error) {
      console.error('Content Moderation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create and export a singleton instance
const openaiService = new OpenAIService();
export default openaiService;
