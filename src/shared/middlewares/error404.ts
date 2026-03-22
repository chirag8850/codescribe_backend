import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { ApiError } from '@/shared/utils/apiError.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    next(
        new ApiError({
            message: `Route ${req.method} ${req.originalUrl} not found`,
            statusCode: HTTP_STATUS.NOT_FOUND,
        }),
    );
};
