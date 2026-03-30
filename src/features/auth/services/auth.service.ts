import crypto from 'crypto';
import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { EmailVerificationRepository } from '../repositories/emailverification.repository.js';
import { LoginOtpRepository } from '../repositories/loginotp.repository.js';
import { PasswordResetRepository } from '../repositories/passwordreset.repository.js';
import type { SignupPayload, JwtTokenPayload, LoginResponse } from '../types/auth.types.js';
import type { IUser } from '../types/schema.types.js';
import { emailService } from '@/shared/services/email/email.service.js';
import { EmailType } from '@/shared/services/email/email.types.js';
import mongoose from 'mongoose';
import { JwtHelper } from '../helpers/jwt.helper.js';
import { config } from '@/shared/config/config.js';

const OTP_EXPIRY_MINUTES = 5;
const PASSWORD_RESET_EXPIRY_HOURS = 1;

export class AuthService {
    private readonly authRepository: AuthRepository;
    private readonly emailVerificationRepository: EmailVerificationRepository;
    private readonly loginOtpRepository: LoginOtpRepository;
    private readonly passwordResetRepository: PasswordResetRepository;

    constructor() {
        this.authRepository = new AuthRepository();
        this.emailVerificationRepository = new EmailVerificationRepository();
        this.loginOtpRepository = new LoginOtpRepository();
        this.passwordResetRepository = new PasswordResetRepository();
    }

    private generateVerificationToken() {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = this.hashToken(rawToken);
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return { rawToken, hashedToken, expiry };
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    private generateOtp(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    private async generateLoginTokens(user: IUser): Promise<LoginResponse> {
        const payload: JwtTokenPayload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email,
            username: user.username,
        };

        const accessToken = JwtHelper.generateAccessToken(payload);
        const refreshToken = JwtHelper.generateRefreshToken(payload);

        const hashedRefreshToken = this.hashToken(refreshToken);
        await this.authRepository.updateRefreshToken(user._id, hashedRefreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                avatar: user.avatar,
                name: user.name,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
            },
        };
    }

    private async findVerifiedUser(identifier: string): Promise<IUser> {
        const user = await this.authRepository.findUserByEmailOrUsername(identifier);

        if (!user) {
            throw new ApiError({
                message: 'User with this email or username does not exist',
                statusCode: HTTP_STATUS.NOT_FOUND,
            });
        }

        if (!user.isVerified) {
            throw new ApiError({
                message: 'Email is not verified',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        return user;
    }

    async signupUser(payload: SignupPayload): Promise<IUser> {
        const { email, username } = payload;

        // Check duplicates
        const existingEmail = await this.authRepository.findUserByEmail(email);
        if (existingEmail) {
            throw new ApiError({
                message: 'Email already registered',
                statusCode: HTTP_STATUS.CONFLICT,
            });
        }

        const existingUsername = await this.authRepository.findUserByUsername(username);
        if (existingUsername) {
            throw new ApiError({
                message: 'Username already taken',
                statusCode: HTTP_STATUS.CONFLICT,
            });
        }

        // Generate token
        const { rawToken, hashedToken, expiry } = this.generateVerificationToken();

        // Create user
        const user = await this.authRepository.createUser(payload);

        // store token in emailVerification collection
        await this.emailVerificationRepository.upsertToken(user._id, hashedToken, expiry);

        // Send Email
        const verifyUrl = `${config.server.serverUrl}/api/v1/auth/verify/${user._id.toString()}/${rawToken}`;

        void emailService.send({
            type: EmailType.VERIFY_EMAIL,
            to: [{ email: user.email, name: user.name }],
            data: { name: user.name, verifyUrl },
        });

        return user;
    }

    async verifyEmail(userId: string, token: string): Promise<void> {
        const userIdObj = new mongoose.Types.ObjectId(userId);
        const user = await this.authRepository.findUserById(userIdObj);

        if (!user) {
            throw new ApiError({
                message: 'User not found',
                statusCode: HTTP_STATUS.NOT_FOUND,
            });
        }

        const hashedToken = this.hashToken(token);
        const emailVerification = await this.emailVerificationRepository.getToken(userIdObj, hashedToken);

        if (!emailVerification) {
            throw new ApiError({
                message: 'Invalid or expired verification token',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        if (emailVerification.expiresAt < new Date()) {
            throw new ApiError({
                message: 'Invalid or expired verification token',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        await this.authRepository.updateUser(userIdObj, { isVerified: true });
        await this.emailVerificationRepository.deleteByUserId(userIdObj);

        const loginUrl = `${config.server.serverUrl}/login`;

        void emailService.send({
            type: EmailType.WELCOME,
            to: [{ email: user.email, name: user.name }],
            data: { name: user.name, loginUrl },
        });
    }

    async resendVerificationEmail(email: string): Promise<void> {
        const user = await this.authRepository.findUserByEmail(email);

        if (!user) {
            throw new ApiError({
                message: 'User with this email does not exist',
                statusCode: HTTP_STATUS.NOT_FOUND,
            });
        }

        if (user.isVerified) {
            throw new ApiError({
                message: 'Email is already verified',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        const { rawToken, hashedToken, expiry } = this.generateVerificationToken();

        await this.emailVerificationRepository.upsertToken(user._id, hashedToken, expiry);

        const verifyUrl = `${config.server.serverUrl}/api/v1/auth/verify/${user._id.toString()}/${rawToken}`;

        void emailService.send({
            type: EmailType.VERIFY_EMAIL,
            to: [{ email: user.email, name: user.name }],
            data: { name: user.name, verifyUrl },
        });
    }

    async checkUsernameAvailability(username: string): Promise<boolean> {
        const user = await this.authRepository.findUserByUsername(username);
        return !user;
    }

    async loginWithPassword(identifier: string, password: string): Promise<LoginResponse> {
        const user = await this.findVerifiedUser(identifier);

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new ApiError({
                message: 'Invalid password',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        return this.generateLoginTokens(user);
    }

    async sendLoginOtp(identifier: string): Promise<void> {
        const user = await this.findVerifiedUser(identifier);

        const otp = this.generateOtp();
        const hashedOtp = this.hashToken(otp);
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        await this.loginOtpRepository.upsertOtp(user._id, hashedOtp, expiresAt);

        void emailService.send({
            type: EmailType.LOGIN_OTP,
            to: [{ email: user.email, name: user.name }],
            data: { name: user.name, otp },
        });
    }

    async verifyLoginOtp(identifier: string, otp: string): Promise<LoginResponse> {
        const user = await this.findVerifiedUser(identifier);

        const hashedOtp = this.hashToken(otp);
        const otpRecord = await this.loginOtpRepository.getOtp(user._id, hashedOtp);

        if (!otpRecord) {
            throw new ApiError({
                message: 'Invalid or expired OTP',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            throw new ApiError({
                message: 'Invalid or expired OTP',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        await this.loginOtpRepository.deleteByUserId(user._id);

        return this.generateLoginTokens(user);
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.authRepository.findUserByEmail(email);

        if (!user) {
            // Don't reveal whether email exists — always return success
            return;
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = this.hashToken(rawToken);
        const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);

        await this.passwordResetRepository.upsertToken(user._id, hashedToken, expiresAt);

        const resetUrl = `${config.server.serverUrl}/reset-password/${user._id.toString()}/${rawToken}`;

        void emailService.send({
            type: EmailType.RESET_PASSWORD,
            to: [{ email: user.email, name: user.name }],
            data: { name: user.name, resetUrl },
        });
    }

    async resetPassword(userId: string, token: string, newPassword: string): Promise<void> {
        const userIdObj = new mongoose.Types.ObjectId(userId);
        const user = await this.authRepository.findUserById(userIdObj);

        if (!user) {
            throw new ApiError({
                message: 'Invalid or expired reset link',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        const hashedToken = this.hashToken(token);
        const resetRecord = await this.passwordResetRepository.getToken(userIdObj, hashedToken);

        if (!resetRecord) {
            throw new ApiError({
                message: 'Invalid or expired reset link',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        if (resetRecord.expiresAt < new Date()) {
            throw new ApiError({
                message: 'Invalid or expired reset link',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        await this.authRepository.updatePassword(userIdObj, newPassword);
        await this.passwordResetRepository.deleteByUserId(userIdObj);

        // Revoke all sessions after password reset
        await this.authRepository.updateRefreshToken(userIdObj, null);
    }

    async changePassword(userId: string, newPassword: string): Promise<void> {
        const userIdObj = new mongoose.Types.ObjectId(userId);

        await this.authRepository.updatePassword(userIdObj, newPassword);

        // Revoke all sessions — user will need to login again with new password
        await this.authRepository.updateRefreshToken(userIdObj, null);
    }

    async getMe(userId: string): Promise<IUser> {
        const userIdObj = new mongoose.Types.ObjectId(userId);
        const user = await this.authRepository.findUserById(userIdObj);

        if (!user) {
            throw new ApiError({
                message: 'User not found',
                statusCode: HTTP_STATUS.NOT_FOUND,
            });
        }

        return user;
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = JwtHelper.verifyRefreshToken(refreshToken);

        const userId = new mongoose.Types.ObjectId(payload.userId);
        const user = await this.authRepository.findUserByIdWithRefreshToken(userId);

        if (!user) {
            throw new ApiError({
                message: 'User not found',
                statusCode: HTTP_STATUS.UNAUTHORIZED,
            });
        }

        // Verify the refresh token matches what's stored in DB
        const hashedToken = this.hashToken(refreshToken);
        if (user.refreshToken !== hashedToken) {
            // Token reuse detected — revoke all tokens for this user
            await this.authRepository.updateRefreshToken(user._id, null);
            throw new ApiError({
                message: 'Invalid refresh token. Please login again.',
                statusCode: HTTP_STATUS.UNAUTHORIZED,
            });
        }

        // Rotate tokens — issue new pair
        const newPayload: JwtTokenPayload = {
            userId: user._id.toString(),
            role: user.role,
            email: user.email,
            username: user.username,
        };

        const newAccessToken = JwtHelper.generateAccessToken(newPayload);
        const newRefreshToken = JwtHelper.generateRefreshToken(newPayload);

        const hashedNewRefreshToken = this.hashToken(newRefreshToken);
        await this.authRepository.updateRefreshToken(user._id, hashedNewRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(refreshToken: string): Promise<void> {
        const payload = JwtHelper.verifyRefreshToken(refreshToken);
        const userId = new mongoose.Types.ObjectId(payload.userId);
        await this.authRepository.updateRefreshToken(userId, null);
    }
}
