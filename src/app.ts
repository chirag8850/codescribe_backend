import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { config } from '@/shared/config/config.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { sendError } from '@/shared/utils/apiResponse.js';
import routes from '@/routes/index.js';
import { globalErrorHandler } from '@/shared/middlewares/globalError.js';
import { notFoundHandler } from '@/shared/middlewares/error404.js';
import logger from '@/shared/utils/logger.js';

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
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req: Request, res: Response) => {
            sendError({
                res,
                message: 'Too many requests, please try again later.',
                statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
            });
        },
    }),
);

// Cookie parsing
app.use(cookieParser());

// Body parsing
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Sanitize MongoDB queries
app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = mongoSanitize.sanitize(req.body) as unknown;
    }
    next();
});

// Performance
app.use(compression());

app.use(
    morgan(':method :url :status :res[content-length]b - :response-time ms', {
        stream: { write: (message) => logger.http(message.trimEnd()) },
    }),
);

// Routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(globalErrorHandler);

export default app;
