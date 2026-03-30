import { Router } from 'express';
import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from './controllers/auth.controller.js';
import { asyncHandler } from '@/shared/utils/asyncHandler.js';
import { validate } from '@/shared/middlewares/validate.js';
import { authenticate } from '@/shared/middlewares/authenticate.js';
import { sendError } from '@/shared/utils/apiResponse.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import {
    signupSchema,
    resendVerifyEmailSchema,
    checkUsernameSchema,
    loginWithPasswordSchema,
    sendLoginOtpSchema,
    verifyLoginOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from './validators/auth.validator.js';

const authRouter = Router();
const authController = new AuthController();

const otpRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 5, // max 5 OTP requests per 5 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        sendError({
            res,
            message: 'Too many OTP requests, please try again after 5 minutes.',
            statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
        });
    },
});

// Public routes
authRouter.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
authRouter.get('/verify-email/:userId/:token', asyncHandler(authController.verifyEmail));
authRouter.post('/resend-verification', validate(resendVerifyEmailSchema), asyncHandler(authController.resendVerificationEmail));
authRouter.get('/check-username', validate(checkUsernameSchema, 'query'), asyncHandler(authController.checkUsername));
authRouter.post('/login/password', validate(loginWithPasswordSchema), asyncHandler(authController.loginWithPassword));
authRouter.post('/login/otp/send', otpRateLimiter, validate(sendLoginOtpSchema), asyncHandler(authController.sendLoginOtp));
authRouter.post('/login/otp/verify', validate(verifyLoginOtpSchema), asyncHandler(authController.verifyLoginOtp));
authRouter.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
authRouter.post('/reset-password', validate(resetPasswordSchema), asyncHandler(authController.resetPassword));
authRouter.post('/refresh', asyncHandler(authController.refreshToken));
authRouter.post('/logout', asyncHandler(authController.logout));

// Protected routes (require access token)
authRouter.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(authController.changePassword));
authRouter.get('/me', authenticate, asyncHandler(authController.getMe));

export default authRouter;
