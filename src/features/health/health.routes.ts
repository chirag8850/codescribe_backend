import { Router } from 'express';
import { asyncHandler } from '@/shared/utils/asyncHandler.js';
import { getHealth } from '@/features/health/health.controller.js';

const healthRouter = Router();

healthRouter.get('/', asyncHandler(getHealth));

export default healthRouter;
