import { Router } from 'express';
import { login, signup } from './controllers/auth.controller.js';
import { asyncHandler } from '@/shared/utils/asyncHandler.js';

const authRouter = Router();

authRouter.post('/signup', asyncHandler(signup));
authRouter.post('/login', asyncHandler(login));

export default authRouter;
