import type { Response } from 'express';
import type { HttpStatus } from '../constants/httpStatus.js';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    statusCode: HttpStatus;
    data?: T | null;
}

export type SendResponseOptions<T> = {
    res: Response;
    message: string;
    statusCode: HttpStatus;
    data?: T | null;
};

export type ApiErrorOptions<T> = Omit<SendResponseOptions<T>, 'res'>;
