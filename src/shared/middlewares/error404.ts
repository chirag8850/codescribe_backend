import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction) => {
    return sendError({
        res,
        message: `Route ${_req.method} ${_req.originalUrl} not found`,
        statusCode: HTTP_STATUS.NOT_FOUND,
    });
};
