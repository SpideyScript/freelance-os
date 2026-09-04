import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { ENV } from './config/env.js';

export const createApp = () => {
  const app = express();

  // Security HTTP headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  const allowedOrigins = [
    'https://freelance-os-client.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ];

// 2. Configure CORS middleware
  const corsOptions = {
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or curl)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, false); // Don't throw Error() — return false to avoid preflight crash
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 204
  };

// 3. Apply CORS before rate-limiters and routes
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // explicitly handle OPTIONS preflight
  // Request Rate Limiting
  app.use('/api', globalLimiter);

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Request Logging
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'freelance-os-server',
    });
  });

  // API Routes
  app.use('/api', routes);

  // 404 handler for undefined API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
  });

  // Centralized error handling middleware
  app.use(errorHandler);

  return app;
};

export const app = createApp();
