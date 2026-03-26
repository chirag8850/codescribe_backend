import crypto from 'crypto';
import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { EmailVerificationRepository } from '../repositories/emailverification.repository.js';
import type { SignupPayload } from '../types/auth.types.js';
import type { IUser } from '../types/schema.types.js';
import { emailService } from '@/shared/services/email/email.service.js';
import { EmailType } from '@/shared/services/email/email.types.js';
import { config } from '@/shared/config/config.js';
import mongoose from 'mongoose';

export class AuthService {
    private readonly authRepository: AuthRepository;
    private readonly emailVerificationRepository: EmailVerificationRepository;

    constructor() {
        this.authRepository = new AuthRepository();
        this.emailVerificationRepository = new EmailVerificationRepository();
    }

    private generateVerificationToken() {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = this.hashToken(rawToken);
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
        return { rawToken, hashedToken, expiry };
    }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
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

        await emailService.send({
            type: EmailType.VERIFY_EMAIL,
            to: { email: user.email, name: user.name },
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
        const emailVerification = await this.emailVerificationRepository.getToken(
            userIdObj,
            hashedToken,
        );

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

        await emailService.send({
            type: EmailType.WELCOME,
            to: { email: user.email, name: user.name },
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

        await emailService.send({
            type: EmailType.VERIFY_EMAIL,
            to: { email: user.email, name: user.name },
            data: { name: user.name, verifyUrl },
        });
    }
}
