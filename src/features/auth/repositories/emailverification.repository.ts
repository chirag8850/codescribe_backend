import type mongoose from 'mongoose';
import EmailVerification from '../models/emailverification.model.js';
import type { IEmailVerification } from '../types/schema.types.js';

export class EmailVerificationRepository {
    async upsertToken(userId: mongoose.Types.ObjectId, token: string, expiresAt: Date): Promise<IEmailVerification> {
        return EmailVerification.findOneAndUpdate(
            { userId },
            { token, expiresAt },
            {
                returnDocument: 'after',
                upsert: true,
            },
        );
    }

    async getToken(userId: mongoose.Types.ObjectId, token: string): Promise<IEmailVerification | null> {
        return EmailVerification.findOne({ userId, token });
    }

    async deleteByUserId(userId: mongoose.Types.ObjectId): Promise<void> {
        await EmailVerification.deleteOne({ userId });
    }
}
