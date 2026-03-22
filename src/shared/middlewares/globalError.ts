import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { ApiError } from '@/shared/utils/apiError.js';
import { config } from '@/shared/config/config.js';
import type { ApiErrorResponse } from '@/shared/types/response.type.js';

export const globalErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const statusCode = err instanceof ApiError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const message =
        err instanceof ApiError || config.server.isDev ? err.message : 'Internal Server Error';

    const response: ApiErrorResponse = {
        success: false,
        message,
        statusCode,
        data: err instanceof ApiError ? err.data : null,
        ...(config.server.isDev && { stack: err.stack }),
    };

    if (!(err instanceof ApiError)) {
        // eslint-disable-next-line no-console
        console.error('Unexpected error:', err);
    }

    res.status(statusCode).json(response);
};
