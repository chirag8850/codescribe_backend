import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { ApiError } from '../utils/apiError.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    next(
        new ApiError({
            message: `Route ${req.method} ${req.originalUrl} not found`,
            statusCode: HTTP_STATUS.NOT_FOUND,
        }),
    );
};
