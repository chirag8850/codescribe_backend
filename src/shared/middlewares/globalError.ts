import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { ApiError } from '@/shared/utils/apiError.js';
import { config } from '@/shared/config/config.js';
import type { ApiErrorResponse } from '@/shared/types/response.type.js';
import logger from '@/shared/utils/logger.js';

export const globalErrorHandler = (
    err: Error,
    req: Request,
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
        logger.error('Unexpected error', {
            stack: err.stack,
            method: req.method,
            url: req.originalUrl,
            body: req.body as unknown,
        });
    }

    res.status(statusCode).json(response);
};
