import type mongoose from 'mongoose';
import PasswordReset from '../models/passwordreset.model.js';
import type { IPasswordReset } from '../types/schema.types.js';

export class PasswordResetRepository {
    async upsertToken(userId: mongoose.Types.ObjectId, token: string, expiresAt: Date): Promise<IPasswordReset> {
        return PasswordReset.findOneAndUpdate(
            { userId },
            { token, expiresAt },
            {
                returnDocument: 'after',
                upsert: true,
            },
        );
    }

    async getToken(userId: mongoose.Types.ObjectId, token: string): Promise<IPasswordReset | null> {
        return PasswordReset.findOne({ userId, token });
    }

    async deleteByUserId(userId: mongoose.Types.ObjectId): Promise<void> {
        await PasswordReset.deleteOne({ userId });
    }
}
