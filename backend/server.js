import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Initialize database (creates tables if they don't exist)
import db from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ======================
// CORS Configuration
// ======================
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true, // Allow cookies and authorization headers
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// ======================
// Body Parsing Middleware
// ======================
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// ======================
// Request Logging (Development)
// ======================
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// ======================
// Security Headers
// ======================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ======================
// Health Check Endpoint
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: 'connected'
  });
});

// ======================
// API Documentation Endpoint
// ======================
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        me: 'GET /api/auth/me',
        changePassword: 'PUT /api/auth/change-password'
      },
      tasks: {
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        getOverdue: 'GET /api/tasks/overdue',
        getStats: 'GET /api/tasks/stats/summary',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        updateStatus: 'PATCH /api/tasks/:id/status',
        delete: 'DELETE /api/tasks/:id'
      }
    }
  });
});

// ======================
// API Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ======================
// 404 Handler - Route Not Found
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  // Log error details
  console.error('Error occurred:');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.stack);

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: NODE_ENV === 'development' ? {
      stack: err.stack,
      ...err
    } : undefined
  });
});

// ======================
// Start Server
// ======================
const server = app.listen(PORT, () => {
  console.log('\n===========================================');
  console.log('🚀 Task Manager API Server');
  console.log('===========================================');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: SQLite (Initialized)`);
  console.log(`🔐 CORS enabled for: ${corsOptions.origin}`);
  console.log('===========================================\n');
});

// ======================
// Graceful Shutdown
// ======================
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log('✓ HTTP server closed');

    // Close database connection
    try {
      db.close();
      console.log('✓ Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
    }

    console.log('✓ Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export default app;
