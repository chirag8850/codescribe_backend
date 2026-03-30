import app from '@/app.js';
import { config } from '@/shared/config/config.js';
import { connectDB, disconnectDB } from '@/shared/config/db.js';
import logger from '@/shared/utils/logger.js';

const PORT = config.server.port;

const startServer = async (): Promise<void> => {
    await connectDB();

    const server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT} in ${config.server.isDev ? 'development' : 'production'} mode`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string): void => {
        logger.info(`${signal} received. Shutting down gracefully...`);
        server.close(() => {
            logger.info('Server closed');
            void disconnectDB().finally(() => process.exit(0));
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
        logger.error('Unhandled Rejection', { reason });
        server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (error: Error) => {
        logger.error('Uncaught Exception', { error });
        process.exit(1);
    });
};

startServer().catch((error: unknown) => {
    logger.error('Failed to start server', { error });
    void disconnectDB().finally(() => process.exit(1));
});
