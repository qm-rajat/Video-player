# Deployment Guide

This guide will walk you through deploying the Adult Content Platform to production.

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Vercel account (for frontend)
- Railway or Render account (for backend)

## Environment Setup

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP addresses (or 0.0.0.0/0 for all)
4. Get your connection string

### 2. Cloudinary Setup

1. Sign up for Cloudinary
2. Get your cloud name, API key, and API secret from the dashboard
3. Create upload presets if needed

### 3. Stripe Setup

1. Create a Stripe account
2. Get your publishable and secret keys
3. Set up webhooks for subscription events
4. Create subscription products and prices

## Backend Deployment (Railway)

### 1. Prepare the Backend

```bash
cd server
npm install
```

### 2. Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize and deploy:
```bash
railway init
railway up
```

4. Set environment variables in Railway dashboard:
```
NODE_ENV=production
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
CLIENT_URL=https://your-frontend-domain.vercel.app
```

## Backend Deployment (Render - Alternative)

### 1. Connect Repository

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Select the `server` directory as the root

### 2. Configure Build Settings

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18

### 3. Set Environment Variables

Add all the environment variables listed above in the Render dashboard.

## Frontend Deployment (Vercel)

### 1. Prepare the Frontend

```bash
cd client
npm install
npm run build
```

### 2. Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-domain.railway.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## Post-Deployment Configuration

### 1. Update CORS Settings

Update the `CLIENT_URL` environment variable in your backend to match your Vercel domain.

### 2. Configure OAuth Callbacks

Update OAuth callback URLs in Google and Twitter developer consoles:
- Google: `https://your-backend-domain.railway.app/api/auth/google/callback`
- Twitter: `https://your-backend-domain.railway.app/api/auth/twitter/callback`

### 3. Set up Stripe Webhooks

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-backend-domain.railway.app/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`

### 4. Test the Deployment

1. Visit your Vercel domain
2. Test user registration and login
3. Test OAuth login
4. Test content upload (if you're a creator)
5. Test subscription flow

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use strong, unique secrets for JWT and other keys
- Rotate keys regularly

### 2. Database Security

- Use MongoDB Atlas with authentication
- Restrict IP access where possible
- Enable MongoDB encryption at rest

### 3. Content Moderation

- Set up automated content scanning
- Implement human moderation workflows
- Have clear community guidelines

### 4. Legal Compliance

- Ensure age verification is working
- Have proper terms of service and privacy policy
- Implement GDPR compliance for EU users
- Set up DMCA takedown procedures

## Monitoring and Maintenance

### 1. Application Monitoring

- Set up error tracking (Sentry, Bugsnag)
- Monitor API response times
- Set up uptime monitoring

### 2. Database Monitoring

- Monitor MongoDB Atlas metrics
- Set up alerts for high usage
- Regular database backups

### 3. CDN and Media

- Monitor Cloudinary usage and costs
- Implement image optimization
- Set up proper caching headers

### 4. Regular Updates

- Keep dependencies updated
- Monitor security advisories
- Regular security audits

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CLIENT_URL environment variable
2. **OAuth Not Working**: Verify callback URLs
3. **Stripe Webhooks Failing**: Check webhook endpoint and signature verification
4. **File Uploads Failing**: Verify Cloudinary credentials
5. **Database Connection Issues**: Check MongoDB Atlas connection string and IP whitelist

### Logs and Debugging

- Check Railway/Render logs for backend issues
- Check Vercel function logs for frontend issues
- Use browser developer tools for client-side debugging

## Scaling Considerations

### 1. Database Scaling

- Use MongoDB Atlas auto-scaling
- Implement database indexing
- Consider read replicas for high traffic

### 2. Media Storage

- Use Cloudinary's CDN for global delivery
- Implement lazy loading
- Optimize image and video formats

### 3. Application Scaling

- Railway and Render auto-scale based on traffic
- Consider implementing Redis for session management
- Use horizontal scaling for high traffic

### 4. Cost Optimization

- Monitor usage across all services
- Implement proper caching strategies
- Optimize media delivery and storage

## Support and Resources

- [Railway Documentation](https://railway.app/docs)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Stripe Documentation](https://stripe.com/docs)

Remember to test thoroughly in a staging environment before deploying to production!