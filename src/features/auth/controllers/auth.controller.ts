import type { Request, Response } from 'express';
import { sendSuccess } from '@/shared/utils/apiResponse.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';

export const signup = (_req: Request, res: Response): void => {
    sendSuccess({ res, message: 'User fetched', statusCode: HTTP_STATUS.OK });
};

export const login = (_req: Request, res: Response): void => {
    sendSuccess({
        res,
        message: 'User fetched',
        statusCode: HTTP_STATUS.OK,
        data: { user: { id: 1, name: 'John Doe', email: 'john.doe@example.com' } },
    });
};
