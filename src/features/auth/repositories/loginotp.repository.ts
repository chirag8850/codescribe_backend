import type mongoose from 'mongoose';
import LoginOtp from '../models/loginotp.model.js';
import type { ILoginOtp } from '../types/schema.types.js';

export class LoginOtpRepository {
    async upsertOtp(userId: mongoose.Types.ObjectId, otp: string, expiresAt: Date): Promise<ILoginOtp> {
        return LoginOtp.findOneAndUpdate(
            { userId },
            { otp, expiresAt },
            {
                returnDocument: 'after',
                upsert: true,
            },
        );
    }

    async getOtp(userId: mongoose.Types.ObjectId, otp: string): Promise<ILoginOtp | null> {
        return LoginOtp.findOne({ userId, otp });
    }

    async deleteByUserId(userId: mongoose.Types.ObjectId): Promise<void> {
        await LoginOtp.deleteOne({ userId });
    }
}
