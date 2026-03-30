import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { JwtHelper } from '@/features/auth/helpers/jwt.helper.js';
import type { JwtTokenPayload } from '@/features/auth/types/auth.types.js';

declare module 'express' {
    interface Request {
        user?: JwtTokenPayload;
    }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError({
            message: 'Access token is required',
            statusCode: HTTP_STATUS.UNAUTHORIZED,
        });
    }

    const token = authHeader.split(' ')[1]!;

    try {
        const payload = JwtHelper.verifyAccessToken(token);
        req.user = payload;
        next();
    } catch {
        throw new ApiError({
            message: 'Invalid or expired access token',
            statusCode: HTTP_STATUS.UNAUTHORIZED,
        });
    }
};
