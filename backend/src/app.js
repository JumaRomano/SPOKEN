require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const memberRoutes = require('./routes/member.routes');
const groupRoutes = require('./routes/group.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const eventRoutes = require('./routes/event.routes');
const financeRoutes = require('./routes/finance.routes');
const reportingRoutes = require('./routes/reporting.routes');
// app.use('/api/communication', communicationRoutes);

const sermonRoutes = require('./routes/sermon.routes');

// Initialize Express app
const app = express();

// Trust proxy - Required for Render and other reverse proxies
// This allows Express to correctly identify client IPs and work with rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS - Allow multiple origins for development and production
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:5173', // Default Vite port
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (process.env.NODE_ENV === 'development' || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', limiter);

// Prevent favicon 404s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Request logging
app.use((req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Spoken Word Of God Ministries ChMS API',
        status: 'active',
        documentation: '/api/docs' // Optional if we had docs
    });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const db = require('./config/database');
        await db.query('SELECT 1');

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Spoken Word Of God Ministries ChMS API',
            version: '1.0.0',
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
        });
    }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/reports', reportingRoutes);
// app.use('/api/communication', communicationRoutes);
app.use('/api/sermons', sermonRoutes);
const minutesRoutes = require('./routes/minutes.routes');
app.use('/api/minutes', minutesRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const runMigrations = require('./database/migrationHandler');

const server = app.listen(PORT, async () => {
    logger.info(`🚀 Spoken Word Of God Ministries ChMS API running on port ${PORT}`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Run DB fixes on startup for environments without shell access (Render Free)
    await runMigrations();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
