import { Router } from 'express';
import { AuthController } from './controllers/auth.controller.js';
import { asyncHandler } from '@/shared/utils/asyncHandler.js';
import { validate } from '@/shared/middlewares/validate.js';
import {
    signupSchema,
    resendVerifyEmailSchema,
    checkUsernameSchema,
} from './validators/auth.validator.js';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
authRouter.post('/login', asyncHandler(authController.login));
authRouter.get('/verify-email/:userId/:token', asyncHandler(authController.verifyEmail));
authRouter.post(
    '/resend-verification',
    validate(resendVerifyEmailSchema),
    asyncHandler(authController.resendVerificationEmail),
);

authRouter.get(
    '/check-username',
    validate(checkUsernameSchema, 'query'),
    asyncHandler(authController.checkUsername),
);

export default authRouter;
