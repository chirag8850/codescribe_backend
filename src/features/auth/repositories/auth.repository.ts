import type mongoose from 'mongoose';
import User from '../models/user.model.js';
import type { IUser } from '../types/schema.types.js';

export class AuthRepository {
    async findUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async findUserByUsername(username: string): Promise<IUser | null> {
        return User.findOne({ username });
    }

    async createUser(payload: Partial<IUser>): Promise<IUser> {
        return User.create(payload);
    }

    async findUserByVerifyToken(token: string): Promise<IUser | null> {
        return User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() },
        });
    }

    async updateUser(
        id: mongoose.Types.ObjectId,
        updateData: Partial<IUser>,
    ): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, updateData, { new: true });
    }
}
