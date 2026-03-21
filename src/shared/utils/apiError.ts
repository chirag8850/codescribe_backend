import type { ApiErrorOptions } from '../types/response.type.js';
import type { HttpStatus } from '../constants/httpStatus.js';

export class ApiError<T = null> extends Error {
    statusCode: HttpStatus;
    data: T | null;

    constructor({ message, statusCode, data = null }: ApiErrorOptions<T>) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.data = data;
    }
}
