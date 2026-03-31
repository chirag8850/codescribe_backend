import type { Request, Response } from 'express';
import { sendSuccess } from '@/shared/utils/apiResponse.js';
import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { AuthService } from '../services/auth.service.js';
import { config } from '@/shared/config/config.js';
import type {
    SignupPayload,
    LoginWithPasswordPayload,
    SendOtpPayload,
    VerifyOtpPayload,
    ForgotPasswordPayload,
    ResetPasswordPayload,
    ChangePasswordPayload,
} from '../types/auth.types.js';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.server.isProd,
    sameSite: config.server.isProd ? 'strict' : 'lax',
    path: '/api/v1/auth',
} as const;

const setRefreshTokenCookie = (res: Response, token: string): void => {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
};

const sendLoginResponse = (res: Response, accessToken: string, refreshToken: string, user: Record<string, unknown>) => {
    setRefreshTokenCookie(res, refreshToken);

    return sendSuccess({
        res,
        message: 'Login successful',
        statusCode: HTTP_STATUS.OK,
        data: { accessToken, user },
    });
};

export class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    signup = async (req: Request, res: Response) => {
        const payload = req.body as SignupPayload;

        const user = await this.authService.signupUser(payload);

        return sendSuccess({
            res,
            message: 'Signup successful',
            statusCode: HTTP_STATUS.CREATED,
            data: {
                id: user._id,
                avatar: user.avatar,
                name: user.name,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
            },
        });
    };

    verifyEmail = async (req: Request, res: Response) => {
        const { userId, token } = req.params;

        if (!token || typeof token !== 'string') {
            throw new ApiError({
                message: 'Verification token is missing in the URL',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        if (!userId || typeof userId !== 'string') {
            throw new ApiError({
                message: 'User ID is missing in the URL',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        await this.authService.verifyEmail(userId, token);

        return sendSuccess({
            res,
            message: 'Email verified successfully!',
            statusCode: HTTP_STATUS.OK,
        });
    };

    resendVerificationEmail = async (req: Request, res: Response) => {
        const { email } = req.body as { email: string };

        await this.authService.resendVerificationEmail(email);

        return sendSuccess({
            res,
            message: 'Verification email resent successfully. Please check your inbox.',
            statusCode: HTTP_STATUS.OK,
        });
    };

    checkUsername = async (req: Request, res: Response) => {
        const { username } = req.query as { username: string };

        if (!username || typeof username !== 'string') {
            throw new ApiError({
                message: 'Username is required',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        const isAvailable = await this.authService.checkUsernameAvailability(username);

        return sendSuccess({
            res,
            message: isAvailable ? 'Username is available' : 'Username is not available',
            statusCode: HTTP_STATUS.OK,
            data: { isAvailable },
        });
    };

    loginWithPassword = async (req: Request, res: Response) => {
        const { identifier, password } = req.body as LoginWithPasswordPayload;
        const { accessToken, refreshToken, user } = await this.authService.loginWithPassword(identifier, password);
        return sendLoginResponse(res, accessToken, refreshToken, user);
    };

    sendLoginOtp = async (req: Request, res: Response) => {
        const { identifier } = req.body as SendOtpPayload;

        await this.authService.sendLoginOtp(identifier);

        return sendSuccess({
            res,
            message: 'OTP sent to your email',
            statusCode: HTTP_STATUS.OK,
        });
    };

    verifyLoginOtp = async (req: Request, res: Response) => {
        const { identifier, otp } = req.body as VerifyOtpPayload;
        const { accessToken, refreshToken, user } = await this.authService.verifyLoginOtp(identifier, otp);
        return sendLoginResponse(res, accessToken, refreshToken, user);
    };

    forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body as ForgotPasswordPayload;

        await this.authService.forgotPassword(email);

        // Always returning success — not revealing whether email exists
        return sendSuccess({
            res,
            message: 'If an account with that email exists, a password reset link has been sent.',
            statusCode: HTTP_STATUS.OK,
        });
    };

    resetPassword = async (req: Request, res: Response) => {
        const { userId, token, newPassword } = req.body as ResetPasswordPayload;

        await this.authService.resetPassword(userId, token, newPassword);

        return sendSuccess({
            res,
            message: 'Password reset successfully. Please login with your new password.',
            statusCode: HTTP_STATUS.OK,
        });
    };

    changePassword = async (req: Request, res: Response) => {
        const { newPassword } = req.body as ChangePasswordPayload;
        const userId = req.user!.userId;

        await this.authService.changePassword(userId, newPassword);

        res.clearCookie(REFRESH_TOKEN_COOKIE, { ...COOKIE_OPTIONS });

        return sendSuccess({
            res,
            message: 'Password changed successfully. Please login again.',
            statusCode: HTTP_STATUS.OK,
        });
    };

    getMe = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const user = await this.authService.getMe(userId);

        return sendSuccess({
            res,
            message: 'User profile fetched successfully',
            statusCode: HTTP_STATUS.OK,
            data: {
                id: user._id,
                avatar: user.avatar,
                name: user.name,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
            },
        });
    };

    refreshToken = async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;

        if (!refreshToken) {
            throw new ApiError({
                message: 'Refresh token not found',
                statusCode: HTTP_STATUS.UNAUTHORIZED,
            });
        }

        const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshAccessToken(refreshToken);

        setRefreshTokenCookie(res, newRefreshToken);

        return sendSuccess({
            res,
            message: 'Token refreshed successfully',
            statusCode: HTTP_STATUS.OK,
            data: { accessToken },
        });
    };

    logout = async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;

        if (refreshToken) {
            await this.authService.logout(refreshToken).catch(() => {
                // Silently ignore — token may already be expired/invalid
            });
        }

        res.clearCookie(REFRESH_TOKEN_COOKIE, { ...COOKIE_OPTIONS });

        return sendSuccess({
            res,
            message: 'Logged out successfully',
            statusCode: HTTP_STATUS.OK,
        });
    };
}
