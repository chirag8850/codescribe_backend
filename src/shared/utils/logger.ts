import winston from 'winston';
import 'winston-mongodb';
import { config } from '@/shared/config/config.js';

const { combine, timestamp, errors, colorize, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
    const log = `[${String(ts)}] ${level}: ${String(message)}`;
    return typeof stack === 'string' ? `${log}\n${stack}` : log;
});

const buildDevLogger = () =>
    winston.createLogger({
        level: 'debug',
        format: combine(
            colorize({ all: true }),
            timestamp({ format: 'HH:mm:ss' }),
            errors({ stack: true }),
            logFormat,
        ),
        transports: [new winston.transports.Console()],
    });

const buildProdLogger = () => {
    const consoleTransport = new winston.transports.Console({
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            logFormat,
        ),
    });

    const mongoTransport = new winston.transports.MongoDB({
        db: config.db.mongoUri,
        collection: 'error_logs',
        level: 'error',
        storeHost: true,
        tryReconnect: true,
        capped: true,
        cappedMax: 10000,
    });

    return winston.createLogger({
        level: 'http',
        transports: [consoleTransport, mongoTransport],
        exceptionHandlers: [consoleTransport],
        rejectionHandlers: [consoleTransport],
        exitOnError: false,
    });
};

const logger = config.server.isDev ? buildDevLogger() : buildProdLogger();

export default logger;
