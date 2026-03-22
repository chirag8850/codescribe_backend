import type { ApiErrorOptions } from '../types/response.type.js';
import type { HttpStatus } from '../constants/httpStatus.js';

export class ApiError extends Error {
    public readonly statusCode: HttpStatus;
    public readonly data: unknown;

    constructor({ message, statusCode, data = null }: ApiErrorOptions) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
