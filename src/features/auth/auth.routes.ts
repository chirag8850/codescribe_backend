import { Router } from 'express';
import { AuthController } from './controllers/auth.controller.js';
import { asyncHandler } from '@/shared/utils/asyncHandler.js';
import { validate } from '@/shared/middlewares/validate.js';
import { signupSchema } from './validators/auth.validator.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
authRouter.post('/login', asyncHandler(authController.login));

export default authRouter;
