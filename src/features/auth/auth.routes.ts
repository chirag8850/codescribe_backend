import { Router } from 'express';
import { AuthController } from './controllers/auth.controller.js';
import { asyncHandler } from '@/shared/utils/asyncHandler.js';
import { validate } from '@/shared/middlewares/validate.js';
import { signupSchema, resendVerifyEmailSchema } from './validators/auth.validator.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
authRouter.post('/login', asyncHandler(authController.login));
authRouter.get('/verify-email/:token', asyncHandler(authController.verifyEmail));
authRouter.post(
    '/resend-verification',
    validate(resendVerifyEmailSchema),
    asyncHandler(authController.resendVerificationEmail),
);

export default authRouter;
