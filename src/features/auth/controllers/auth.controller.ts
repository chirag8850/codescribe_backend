import type { Request, Response } from 'express';
import { sendSuccess } from '@/shared/utils/apiResponse.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { emailService } from '@/shared/services/email/email.service.js';
import { EmailType } from '@/shared/services/email/email.types.js';
import { config } from '@/shared/config/config.js';

export const signup = async (_req: Request, res: Response): Promise<void> => {
    await emailService.send({
        type: EmailType.WELCOME,
        to: { email: 'chiragvaviya98@gmail.com', name: 'Chirag Vaviya' },
        data: {
            name: 'Chirag Vaviya',
            loginUrl: `${config.server.serverUrl}/login`,
        },
    });

    sendSuccess({ res, message: 'Signup successful', statusCode: HTTP_STATUS.CREATED });
};

export const login = (_req: Request, res: Response): void => {
    sendSuccess({
        res,
        message: 'User fetched',
        statusCode: HTTP_STATUS.OK,
        data: { user: { id: 1, name: 'Chirag Vaviya', email: 'chiragvaviya98@gmail.com' } },
    });
};
