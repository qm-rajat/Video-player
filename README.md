# Adult Content Platform - MERN Stack

A full-stack adult content platform built with the MERN stack, featuring user-generated content, subscriptions, payments, and comprehensive moderation tools.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based auth with OAuth (Google, Twitter)
- **Age Verification**: Mandatory 18+ verification system
- **Role-based Access Control**: Viewer, Creator, and Admin roles
- **Media Management**: Upload, stream, and manage video/image content
- **Subscription System**: Tiered subscriptions with Stripe integration
- **Payment Processing**: Secure payments and creator payouts
- **Content Moderation**: Comprehensive reporting and admin tools

### Technical Features
- **Frontend**: React 18 with Redux Toolkit
- **Backend**: Node.js with Express and MongoDB
- **Media Storage**: Cloudinary integration
- **Payments**: Stripe for subscriptions and one-time payments
- **Real-time Features**: Live streaming capabilities
- **Security**: Helmet, rate limiting, input validation
- **Responsive Design**: Mobile-first with Tailwind CSS

## 📁 Project Structure

```
adult-content-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store and slices
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account
- Stripe account

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret

# Frontend URL
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd adult-content-platform
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

3. **Set up environment variables**
```bash
# Copy example files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit the .env files with your actual values
```

4. **Start the development servers**
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run server  # Backend only
npm run client  # Frontend only
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Railway**
- Connect your GitHub repository
- Set environment variables in Railway dashboard
- Deploy automatically

3. **Deploy to Render** (Alternative)
- Connect your GitHub repository
- Configure build and start commands
- Set environment variables

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from client directory
cd client
vercel

# Set environment variables in Vercel dashboard
```

2. **Configure Build Settings**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Password reset

### Media Endpoints
- `GET /api/media` - Get media feed
- `GET /api/media/:id` - Get single media
- `POST /api/media/upload` - Upload media (creators)
- `PUT /api/media/:id` - Update media (owners)
- `DELETE /api/media/:id` - Delete media (owners)

### Payment Endpoints
- `GET /api/payments/plans` - Get subscription plans
- `POST /api/payments/subscribe` - Create subscription
- `GET /api/payments/subscriptions` - Get user subscriptions
- `DELETE /api/payments/subscription/:id` - Cancel subscription

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/reports` - Reported content
- `PUT /api/admin/moderate/:type/:id` - Moderate content
- `GET /api/admin/users` - User management

## 🔒 Security Features

- **Age Verification**: Mandatory 18+ verification
- **Content Moderation**: Reporting and admin review system
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization
- **HTTPS Only**: Secure connections in production
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Security headers and CSP

## 🎨 UI/UX Features

- **Dark Theme**: Adult-focused dark design
- **Responsive Design**: Mobile-first approach
- **Infinite Scroll**: Seamless content browsing
- **Video Player**: Custom video player with controls
- **Search & Filters**: Advanced content discovery
- **User Profiles**: Detailed creator and user profiles

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📝 Legal Compliance

The platform includes:
- Terms of Service
- Privacy Policy
- DMCA Takedown Policy
- Community Guidelines
- Age verification system
- Content reporting tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

- This is an adult content platform - ensure compliance with local laws
- Implement proper age verification in production
- Use HTTPS in production environments
- Regularly update dependencies for security
- Monitor content for compliance with platform policies

## 🔗 Links

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Stripe Documentation](https://stripe.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://railway.app/docs)

## 📞 Support

For support, please contact [your-email@example.com] or create an issue in the repository.