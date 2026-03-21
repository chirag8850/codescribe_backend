import type { Response } from 'express';
import type { SendResponseOptions, ApiResponse } from '../types/response.type.js';

const sendResponse = <T>(
    success: boolean,
    { res, message, statusCode, data = null }: SendResponseOptions<T>,
): Response => {
    const response: ApiResponse<T> = {
        success,
        message,
        statusCode,
        data,
    };
    return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(options: SendResponseOptions<T>): Response =>
    sendResponse<T>(true, options);

export const sendError = <T>(options: SendResponseOptions<T>): Response =>
    sendResponse<T>(false, options);
