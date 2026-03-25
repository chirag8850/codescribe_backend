import type { Document } from 'mongoose';
import type { UserRole } from '@/shared/constants/userRoles.js';

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

export interface SignupPayload {
    avatar?: string;
    name: string;
    username: string;
    email: string;
    password: string;
}
