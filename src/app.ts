import express from 'express';
import type { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from './shared/config/config.js';
import routes from './routes/index.js';

const app: Application = express();

// Security
app.use(helmet());
app.use(
    cors({
        origin: config.server.serverUrl,
        credentials: true,
        methods: ['GET', 'POST'],
    }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//performance
app.use(compression());

// routes
app.use('/api/v1', routes);

export default app;
