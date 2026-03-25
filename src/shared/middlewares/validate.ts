import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';

export const validate =
    (schema: z.ZodType) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));

            throw new ApiError({
                message: 'Validation failed',
                statusCode: HTTP_STATUS.BAD_REQUEST,
                data: errors,
            });
        }

        req.body = result.data as Record<string, unknown>;
        next();
    };
