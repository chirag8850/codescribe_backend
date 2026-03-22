import type { Response } from 'express';
import type { HttpStatus } from '../constants/httpStatus.js';

export interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    statusCode: HttpStatus;
    data: T | null;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    statusCode: HttpStatus;
    data: unknown;
    stack?: string;
}

export interface SendResponseOptions<T = null> {
    res: Response;
    message: string;
    statusCode: HttpStatus;
    data?: T | null;
}

export interface ApiErrorOptions {
    message: string;
    statusCode: HttpStatus;
    data?: unknown;
}
