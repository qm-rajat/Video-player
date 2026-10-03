const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const animeRoutes = require('./routes/anime');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

// Initialize Express app
const app = express();

// Security middleware - iframe compatible for AI Studio
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  frameguard: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // generous limit for preview environment
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Connect to MongoDB if a valid remote URI is provided (fail-safe for AI Studio)
mongoose.set('bufferCommands', false);
const isLocalhostMongo = !process.env.MONGO_URI || 
  process.env.MONGO_URI.includes('localhost') || 
  process.env.MONGO_URI.includes('127.0.0.1');

if (process.env.MONGO_URI && !isLocalhostMongo) {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 3000
  })
  .then(() => logger.info('MongoDB connected successfully'))
  .catch(err => {
    logger.info('MongoDB unavailable, mock store active: ' + err.message);
  });
} else {
  logger.info('Using in-memory store for anime and video content platform');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/anime', animeRoutes);

// API 404 handler
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Serve frontend static build
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// SPA fallback for all non-API GET routes
app.get('*', (req, res) => {
  const indexHtml = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Video Platform Loading</title></head>
        <body style="font-family: sans-serif; background: #111827; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center;">
            <h2>Video Player Platform</h2>
            <p>Frontend assets are compiling, please refresh in a moment...</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Database offline error middleware fallback
app.use((err, req, res, next) => {
  if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || (err.message && err.message.includes('buffering timed out'))) {
    logger.warn('[AI Studio] Database offline — returning mock empty response');
    if (req.method === 'GET') {
      return res.json({ success: true, data: req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {} });
    }
    return res.status(503).json({ success: false, message: 'Database offline fallback' });
  }
  next(err);
});

// Error handling middleware
app.use(errorHandler);

// Start server on port 3000 and host 0.0.0.0
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;