import type { Request, Response, NextFunction } from 'express';

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export const asyncHandler =
    (fn: RequestHandler) =>
    (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
