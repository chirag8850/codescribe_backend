import crypto from 'crypto';
import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import type { IUser, SignupPayload } from '../types/auth.types.js';
import { emailService } from '@/shared/services/email/email.service.js';
import { EmailType } from '@/shared/services/email/email.types.js';
import { config } from '@/shared/config/config.js';

export class AuthService {
    private readonly authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    private generateVerificationToken() {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        return { rawToken, hashedToken, expiry };
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
        const user = await this.authRepository.createUser({
            ...payload,
            verifyToken: hashedToken,
            verifyTokenExpiry: expiry,
        });

        // Send Email
        const verifyUrl = `${config.server.serverUrl}/api/v1/auth/verify-email/${rawToken}`;

        await emailService.send({
            type: EmailType.VERIFY_EMAIL,
            to: { email: user.email, name: user.name },
            data: { name: user.name, verifyUrl },
        });

        return user;
    }

    async verifyEmail(token: string): Promise<void> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await this.authRepository.findUserByVerifyToken(hashedToken);

        if (!user) {
            throw new ApiError({
                message: 'Invalid or expired verification token',
                statusCode: HTTP_STATUS.BAD_REQUEST,
            });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

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

        await this.authRepository.updateUser(user._id, {
            verifyToken: hashedToken,
            verifyTokenExpiry: expiry,
        });

        const verifyUrl = `${config.server.serverUrl}/api/v1/auth/verify-email/${rawToken}`;

        await emailService.send({
            type: EmailType.VERIFY_EMAIL,
            to: { email: user.email, name: user.name },
            data: { name: user.name, verifyUrl },
        });
    }
}
