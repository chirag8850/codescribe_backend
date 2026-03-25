import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import type { IUser, SignupPayload } from '../types/auth.types.js';

export class AuthService {
    private readonly authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    async signupUser(payload: SignupPayload): Promise<IUser> {
        const { email, username } = payload;

        // Check if email already exists
        const existingEmail = await this.authRepository.findUserByEmail(email);
        if (existingEmail) {
            throw new ApiError({
                message: 'Email already registered',
                statusCode: HTTP_STATUS.CONFLICT,
            });
        }

        // Check if username already exists
        const existingUsername = await this.authRepository.findUserByUsername(username);
        if (existingUsername) {
            throw new ApiError({
                message: 'Username already taken',
                statusCode: HTTP_STATUS.CONFLICT,
            });
        }

        // Create user (password hashing handled by model pre-save hook)
        const user = await this.authRepository.createUser(payload);

        return user;
    }
}
