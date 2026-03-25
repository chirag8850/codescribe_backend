import User from '../models/user.model.js';
import type { IUser, SignupPayload } from '../types/auth.types.js';

export class AuthRepository {
    async findUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async findUserByUsername(username: string): Promise<IUser | null> {
        return User.findOne({ username });
    }

    async createUser(payload: SignupPayload): Promise<IUser> {
        return User.create(payload);
    }
}
