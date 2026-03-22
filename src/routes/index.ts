import { Router } from 'express';
import type { Request, Response } from 'express';
import { authRouter } from '../features/auth/index.js';
import { sendSuccess } from '../shared/utils/apiResponse.js';
import { HTTP_STATUS } from '../shared/constants/httpStatus.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    sendSuccess({ res, message: 'OK', statusCode: HTTP_STATUS.OK });
});

// Feature routes
router.use('/auth', authRouter);

export default router;
