import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import type { IUser } from '../types/schema.types.js';
import { USER_ROLES } from '@/shared/constants/userRoles.js';

const SALT_ROUNDS = 10;

const userSchema = new Schema<IUser>(
    {
        avatar: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            lowercase: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
            match: [
                /^[a-zA-Z0-9_]+$/,
                'Username can only contain letters, numbers, and underscores',
            ],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifyToken: {
            type: String,
            select: false,
        },
        verifyTokenExpiry: {
            type: Date,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.USER,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// Hashing password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

const User = model<IUser>('User', userSchema);

export default User;
