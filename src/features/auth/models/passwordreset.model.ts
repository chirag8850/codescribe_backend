import { Schema, model } from 'mongoose';
import type { IPasswordReset } from '../types/schema.types.js';

const passwordResetSchema = new Schema<IPasswordReset>(
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
        collection: 'pending_password_resets',
    },
);

// TTL index — MongoDB auto-deletes document when expiresAt is reached
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = model<IPasswordReset>('PasswordReset', passwordResetSchema);
export default PasswordReset;
