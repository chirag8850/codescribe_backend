import os from 'node:os';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess, sendError } from '@/shared/utils/apiResponse.js';
import { HTTP_STATUS } from '@/shared/constants/httpStatus.js';
import { config } from '@/shared/config/config.js';

const DB_STATES: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
};

export const getHealth = (_req: Request, res: Response): void => {
    const dbState = DB_STATES[mongoose.connection.readyState] ?? 'unknown';
    const isHealthy = dbState === 'connected';
    const mem = process.memoryUsage();

    const send = isHealthy ? sendSuccess : sendError;

    send({
        res,
        message: isHealthy ? 'OK' : 'Service Unavailable',
        statusCode: isHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE,
        data: {
            application: {
                environment: config.server.nodeEnv,
                uptime: `${Math.floor(process.uptime())} seconds`,
                memoryUsage: {
                    heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                    heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                },
            },
            system: {
                cpuUsage: os.loadavg(),
                totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
                freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
            },
            database: dbState,
            timestamp: Date.now(),
        },
    });
};
