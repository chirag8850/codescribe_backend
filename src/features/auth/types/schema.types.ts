import type { Document } from 'mongoose';
import type { UserRole } from '@/shared/constants/userRoles.js';
import mongoose from 'mongoose';

export interface IUser extends Document {
    avatar?: string;
    name: string;
    username: string;
    email: string;
    password: string;
    refreshToken: string | null;
    isVerified: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

export interface IEmailVerification extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
}

export interface ILoginOtp extends Document {
    userId: mongoose.Types.ObjectId;
    otp: string;
    expiresAt: Date;
}

export interface IPasswordReset extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
}
