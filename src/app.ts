import express from 'express';
import type { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from './shared/config/config.js';
import routes from './routes/index.js';
import { globalErrorHandler } from './shared/middlewares/globalError.js';
import { notFoundHandler } from './shared/middlewares/error404.js';

const app: Application = express();

// Security
app.use(helmet());
app.use(
    cors({
        origin: config.server.corsOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
);

// Body parsing
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Performance
app.use(compression());

// Routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(globalErrorHandler);

export default app;
