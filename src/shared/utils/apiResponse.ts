import type { Response } from 'express';
import type { SendResponseOptions, ApiResponse } from '@/shared/types/response.type.js';

const sendResponse = <T = null>(success: boolean, { res, message, statusCode, data = null }: SendResponseOptions<T>): Response => {
    const response: ApiResponse<T> = {
        success,
        message,
        statusCode,
        data: data ?? null,
    };
    return res.status(statusCode).json(response);
};

export const sendSuccess = <T = null>(options: SendResponseOptions<T>): Response => sendResponse<T>(true, options);

export const sendError = <T = null>(options: SendResponseOptions<T>): Response => sendResponse<T>(false, options);
