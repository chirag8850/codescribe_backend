import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ApiError } from '../utils/apiError.js';

export const globalErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): Response => {
    if (err instanceof ApiError) {
        return sendError({
            res,
            message: err.message,
            statusCode: err.statusCode,
            data: err.data as unknown,
        });
    }

    return sendError({
        res,
        message: 'Internal Server Error',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
};
