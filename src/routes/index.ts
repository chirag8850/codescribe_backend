import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.json({ message: 'OK' });
});

export default router;
