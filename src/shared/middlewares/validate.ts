import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import { ApiError } from '@/shared/utils/apiError.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';

export const validate =
    (schema: z.ZodType, source: 'body' | 'query' | 'params' = 'body') =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[source]);

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

        if (source === 'body') {
            req.body = result.data as Record<string, unknown>;
        } else if (source === 'query') {
            Object.assign(req.query, result.data as Record<string, unknown>);
        } else if (source === 'params') {
            Object.assign(req.params, result.data as Record<string, unknown>);
        }
        next();
    };
