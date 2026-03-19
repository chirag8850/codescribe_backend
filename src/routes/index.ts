import { Router } from 'express';
import type { Request, Response } from 'express';
import { authRouter } from '../features/auth/index.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.json({ message: 'OK' });
});

// Feature routes
router.use('/auth', authRouter);

export default router;
