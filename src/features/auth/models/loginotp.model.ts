import { Schema, model } from 'mongoose';
import type { ILoginOtp } from '../types/schema.types.js';

const loginOtpSchema = new Schema<ILoginOtp>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: 'pending_login_otps',
    },
);

// TTL index — MongoDB auto-deletes document when expiresAt is reached
loginOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LoginOtp = model<ILoginOtp>('LoginOtp', loginOtpSchema);
export default LoginOtp;
