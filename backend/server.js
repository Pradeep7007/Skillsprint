const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testRoutes = require('./routes/testRoutes');
const proctorRoutes = require('./routes/proctorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Middlewares
// 1. Helmet to secure Express headers
app.use(helmet());

// 2. Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// 3. Rate limiting for general API requests
app.use('/api/', apiLimiter);

// 4. Body parser
app.use(express.json());

// 5. Sanitize data to prevent MongoDB Operator Injection
app.use(mongoSanitize());

// HTTP request logger in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/test', testRoutes);
app.use('/api/proctor', proctorRoutes);
app.use('/api/admin', adminRoutes);

// Root health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Online Aptitude Test Portal API is running smoothly',
  });
});

// Serve frontend build static files in production if needed
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
