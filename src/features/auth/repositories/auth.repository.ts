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

    async findUserById(id: mongoose.Types.ObjectId): Promise<IUser | null> {
        return User.findById(id);
    }

    async createUser(payload: Partial<IUser>): Promise<IUser> {
        const user: IUser = (await User.create(payload)) as IUser;
        return user;
    }

    async findUserByVerifyToken(token: string): Promise<IUser | null> {
        const user: IUser | null = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() },
        });
        return user;
    }

    async updateUser(id: mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
        const user: IUser | null = await User.findByIdAndUpdate(id, updateData, { new: true });
        return user;
    }

    async findUserByEmailOrUsername(identifier: string): Promise<IUser | null> {
        return (await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        }).select('+password')) as unknown as IUser | null;
    }

    async updateRefreshToken(id: mongoose.Types.ObjectId, refreshToken: string | null): Promise<void> {
        await User.findByIdAndUpdate(id, { refreshToken });
    }

    async findUserByIdWithRefreshToken(id: mongoose.Types.ObjectId): Promise<IUser | null> {
        return (await User.findById(id).select('+refreshToken')) as unknown as IUser | null;
    }

    async updatePassword(id: mongoose.Types.ObjectId, password: string): Promise<void> {
        const user = await User.findById(id).select('+password');
        if (user) {
            user.password = password;
            await user.save();
        }
    }
}
