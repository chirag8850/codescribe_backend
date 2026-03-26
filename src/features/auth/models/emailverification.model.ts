import { Schema, model } from 'mongoose';
import type { IEmailVerification } from '../types/schema.types.js';

const emailVerificationSchema = new Schema<IEmailVerification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        token: {
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
        collection: 'pending_email_verifications',
    },
);

// TTL index — MongoDB auto-deletes document when expiresAt is reached
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailVerification = model<IEmailVerification>('EmailVerification', emailVerificationSchema);
export default EmailVerification;
