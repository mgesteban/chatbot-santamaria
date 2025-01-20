# AWS CloudFront Deployment Checklist

## Prerequisites
- [ ] AWS CLI installed and configured
- [ ] Node.js and npm installed
- [ ] Access to AWS Console with necessary permissions
- [ ] Domain name (if using custom domain)

## 1. Backend (Elastic Beanstalk) Setup
### Initial Configuration
- [x] Verify backend runs locally
- [x] Test OpenAI API integration locally
- [x] Configure environment variables in `.ebextensions/env.config`
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    OPENAI_API_KEY: configured
    CORS_ORIGIN: https://d3thk52w5dqo5m.cloudfront.net
```

### CORS Configuration
- [x] Update CORS settings in backend code
```javascript
app.use(cors({
    origin: ['https://d3thk52w5dqo5m.cloudfront.net'],
    credentials: true,
    methods: ['GET', 'POST']
}));
```

### Deployment
- [x] Run backend deployment commands
```bash
cd backend
npm run deploy:init    # First time only
npm run deploy:create  # First time only
npm run deploy        # Regular deployments
```
- [x] Verify health check endpoint (`/health`)
- [x] Test API endpoints directly using Elastic Beanstalk URL

## 2. Frontend Setup
### Build Configuration
- [x] Update API URL in frontend code
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://d3thk52w5dqo5m.cloudfront.net';
```
- [x] Set up environment variables in `.env`
```plaintext
REACT_APP_API_URL=https://d3thk52w5dqo5m.cloudfront.net
```
- [x] Build the frontend
```bash
cd frontend
npm run build
```
- [x] Verify build output in `build/` directory

## 3. S3 Bucket Setup
### Create and Configure Bucket
- [x] Create S3 bucket for frontend files
```bash
aws s3 mb s3://chatbot-santamaria-frontend
```
- [x] Enable static website hosting on bucket
- [x] Apply bucket policy for CloudFront access
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::chatbot-santamaria-frontend/*"
        }
    ]
}
```
- [x] Upload frontend build to S3
```bash
aws s3 sync build/ s3://chatbot-santamaria-frontend --delete
```

## 4. CloudFront Distribution Setup
### Create Distribution
- [x] Create new CloudFront distribution
- [x] Configure origins:
  - [x] S3 bucket origin for static files
  - [x] Elastic Beanstalk origin for API

### Configure Behaviors
- [x] Set up API behavior:
```yaml
Path Pattern: /api/*
Origin: Elastic-Beanstalk-Origin
Cache Policy: CachingDisabled
Origin Request Policy: AllViewerExceptHostHeader
Response Headers Policy: CORS-With-Preflight
```
- [x] Set up default behavior for static content:
```yaml
Path Pattern: /* (default)
Origin: S3-Origin
Cache Policy: CachingOptimized
```

### Configure Error Pages
- [x] Add error page rules for SPA:
```yaml
HTTP Error Code: 403
Response Page Path: /index.html
Response Code: 200

HTTP Error Code: 404
Response Page Path: /index.html
Response Code: 200
```

## 5. SSL/TLS Configuration
- [x] Request or import SSL certificate in ACM
- [x] Configure SSL certificate in CloudFront
- [x] Set security policy to TLSv1.2_2021

## 6. Testing
### Backend Tests
- [x] Verify health check endpoint
- [ ] Test API endpoints through CloudFront (In Progress - Debugging 504 error)
- [x] Verify CORS headers
- [ ] Check API response times

### Frontend Tests
- [x] Test static file delivery
- [x] Verify routing works (no 404s)
- [ ] Test API integration through frontend
- [ ] Check console for errors

## 7. Maintenance
### Cache Management
- [x] Create cache invalidation when needed:
```bash
aws cloudfront create-invalidation --distribution-id E3TEUE68UN0KZW --paths "/*"
```

### Monitoring Setup
- [x] Set up CloudWatch alarms
- [x] Configure access logging
- [x] Set up error notifications

## 8. Security Checks
- [x] Verify CORS settings
- [x] Check security headers
- [x] Review bucket permissions
- [x] Audit CloudFront settings
- [x] Verify SSL/TLS configuration

## Common Issues & Solutions
1. CORS Errors
   - [x] Verify CORS settings in backend
     * Updated Express CORS configuration
     * Added explicit OPTIONS request handling
     * Configured nginx to handle CORS headers
   - [x] Check Origin header in requests
     * Confirmed Origin: https://d3thk52w5dqo5m.cloudfront.net
   - [x] Confirm CloudFront is forwarding headers
     * Removed CloudFront CORS headers policy to let backend handle CORS
     * Updated CloudFront behavior settings:
       - Protocol: HTTP only for origin
       - Port: 80 (nginx)
       - Response headers policy: None
   - Current Status: Debugging CORS headers format

2. Routing Issues
   - [x] Check error page configuration
     * Added 403/404 -> index.html rules
   - [x] Verify default root object
     * Set to index.html
   - [x] Test direct S3 access is blocked
     * Confirmed S3 bucket is private
     * Access only through CloudFront

3. Caching Issues
   - [x] Review cache settings
     * Frontend (Default *): CachingOptimized
     * API (/api/*): CachingDisabled
   - [x] Check cache behavior patterns
     * Default (*) -> S3 bucket
     * /api/* -> Elastic Beanstalk
   - [x] Verify API calls aren't cached
     * Confirmed CachingDisabled for /api/* behavior

4. SSL/TLS Issues
   - [x] Verify certificate region
     * Using CloudFront's default certificate
   - [x] Check certificate coverage
     * *.cloudfront.net covers our domain
   - [x] Confirm security policy
     * Set to TLSv1.2_2021
     * Viewer: HTTPS or redirect to HTTPS
     * Origin: HTTP only (internal)

## Deployment Commands Quick Reference
```bash
# Backend Deployment
cd backend
npm run deploy

# Frontend Build & Deploy
cd frontend
npm run build
aws s3 sync build/ s3://chatbot-santamaria-frontend --delete

# CloudFront Cache Invalidation
aws cloudfront create-invalidation --distribution-id E3TEUE68UN0KZW --paths "/*"
```

## Current Status
1. Frontend:
   - [x] Built and deployed to S3
   - [x] CloudFront distribution configured
   - [x] Environment variables updated
   - [ ] Testing CORS functionality

2. Backend:
   - [x] Deployed to Elastic Beanstalk
   - [x] MongoDB connection working
   - [x] OpenAI integration verified
   - [ ] CORS headers formatting issue
   
3. Infrastructure:
   - [x] S3 bucket configured
   - [x] CloudFront distribution set up
   - [x] Security groups updated
   - [x] MongoDB Atlas IP whitelist updated

4. Next Steps:
   - Fix CORS headers formatting
   - Test frontend-backend communication
   - Verify chat functionality
