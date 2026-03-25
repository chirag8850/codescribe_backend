import type { Request, Response } from 'express';
import { sendSuccess } from '@/shared/utils/apiResponse.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { AuthService } from '../services/auth.service.js';
import type { SignupPayload } from '../types/auth.types.js';

export class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    signup = async (req: Request, res: Response) => {
        const payload = req.body as SignupPayload;

        const user = await this.authService.signupUser(payload);

        return sendSuccess({
            res,
            message: 'Signup successful',
            statusCode: HTTP_STATUS.CREATED,
            data: {
                id: user._id,
                avatar: user.avatar,
                name: user.name,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
            },
        });
    };

    login = (_req: Request, res: Response) => {
        return sendSuccess({
            res,
            message: 'User fetched',
            statusCode: HTTP_STATUS.OK,
            data: { user: { id: 1, name: 'Chirag Vaviya', email: 'chiragvaviya98@gmail.com' } },
        });
    };
}
