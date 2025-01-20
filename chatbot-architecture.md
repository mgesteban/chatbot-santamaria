# Chatbot Architecture

## Overview
This document outlines the architecture of our chatbot application.

## System Components

### Frontend
- React-based user interface
- Components:
  - ChatWindow
  - EmailForm
  - MessageInput
  - MessageList

### Backend
- Node.js server
- Key components:
  - Express.js web framework
  - MongoDB database
  - OpenAI integration
  - JWT authentication

## Data Flow
1. User sends message through frontend interface
2. Message is sent to backend API
3. Backend processes request and communicates with OpenAI
4. Response is sent back to frontend
5. Frontend displays response to user

## Authentication
- JWT-based authentication system
- Secure token generation and validation

## Database Schema
- User model for storing user information
- Chat model for storing conversation history

## Environment Configuration
- Frontend environment variables
- Backend environment variables including:
  - OpenAI API configuration
  - Database connection
  - JWT secret
  - CORS settings

## API Endpoints
(Document your API endpoints here)

## Security Measures
- JWT authentication
- Environment variable protection
- CORS configuration
- Secure communication protocols

## Deployment

### Infrastructure
- Frontend: 
  - CloudFront distribution (https://d3thk52w5dqo5m.cloudfront.net)
  - S3 bucket (chatbot-santamaria-frontend) for static assets
  - CloudFront behaviors:
    * Default (*): Routes to S3 bucket with CachingOptimized policy
    * /api/*: Routes to Elastic Beanstalk with CachingDisabled policy
  - CORS headers policy configured for frontend-backend communication

- Backend: AWS Elastic Beanstalk
  - Platform: Node.js 18 running on 64bit Amazon Linux 2023/6.4.1
  - Instance Type: t2.micro
  - Environment: Single instance
  - Nginx Configuration:
    * Listens on port 80
    * Proxies requests to Node.js app on port 8080
    * Configured with proper headers for proxy setup

### Deployment Process
1. Backend Deployment:
   ```bash
   cd backend
   npm run deploy:init    # First time only: Initialize EB application
   npm run deploy:create  # First time only: Create production environment
   npm run deploy        # Deploy new changes
   ```
   - Elastic Beanstalk automatically:
     * Deploys the application
     * Configures nginx as reverse proxy
     * Sets up environment variables
     * Manages SSL/TLS termination

2. Frontend Deployment:
   ```bash
   cd frontend
   npm run build         # Build the React application
   aws s3 sync build/ s3://chatbot-santamaria-frontend --delete  # Upload to S3
   ```
   - CloudFront distribution:
     * Serves static files from S3 bucket
     * Routes API requests to Elastic Beanstalk
     * Handles SSL/TLS termination
     * Manages CORS headers

### Environment Configuration
- Production environment variables are managed through:
  - Elastic Beanstalk environment variables:
    * NODE_ENV: production
    * PORT: 8080 (internal port for Node.js app)
    * OPENAI_API_KEY: Configured for OpenAI service
    * OPENAI_ASSISTANT_ID: Configured for specific assistant
    * DATABASE_URL: MongoDB Atlas connection string
    * CORS_ORIGIN: Set to CloudFront domain
  - Frontend environment variables (.env):
    * REACT_APP_API_URL: Set to CloudFront domain
  - AWS credentials configured via AWS CLI
  - CloudFront distribution URL set in CORS configuration

### Security Considerations
- Environment variables stored securely in EB configuration
- AWS credentials managed through AWS CLI configuration
- CORS configured to allow only CloudFront origin
- MongoDB connection string secured in environment variables
- Security Groups:
  * Elastic Beanstalk: Configured to allow inbound traffic on ports 80/443
  * CloudFront IP ranges whitelisted for backend access
- S3 Bucket:
  * Private access only
  * CloudFront Origin Access Identity for secure access
- MongoDB Atlas:
  * IP whitelist configured for Elastic Beanstalk instance
  * Secure connection string with authentication
