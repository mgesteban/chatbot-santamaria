# AI Chat Assistant

A full-stack chatbot application that uses OpenAI's Assistants API to provide intelligent responses based on trained data.

## Features

- Real-time chat interface
- OpenAI Assistants API integration
- Conversation thread persistence
- MongoDB database integration
- JWT authentication
- CORS security

## Tech Stack

### Frontend
- React.js
- Modern JavaScript (ES6+)
- CSS3 for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- OpenAI API

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   └── index.js       # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
│
└── README.md
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in backend directory
   - Required variables:
     ```
     PORT=8080
     NODE_ENV=development
     OPENAI_API_KEY=your_openai_api_key
     OPENAI_ASSISTANT_ID=your_assistant_id
     DATABASE_URL=your_mongodb_url
     JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=http://localhost:3000
     ```

4. Start the servers:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend server
   cd ../frontend
   npm start
   ```

## Architecture

The application follows a client-server architecture:
- Frontend communicates with backend via REST API
- Backend uses OpenAI Assistants API for chat functionality
- Conversations are persisted in MongoDB
- JWT handles authentication
- CORS is configured for security

For more details, see [chatbot-architecture.md](chatbot-architecture.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
