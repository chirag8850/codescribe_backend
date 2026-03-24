import { Router } from 'express';
import { authRouter } from '@/features/auth/index.js';
import healthRouter from '@/features/health/health.routes.js';

const router = Router();

router.use('/health', healthRouter);

// Feature routes
router.use('/auth', authRouter);

export default router;
