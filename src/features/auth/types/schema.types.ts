import type { Document } from 'mongoose';
import type { UserRole } from '@/shared/constants/userRoles.js';
import mongoose from 'mongoose';

export interface IUser extends Document {
    avatar?: string;
    name: string;
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEmailVerification extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
}
