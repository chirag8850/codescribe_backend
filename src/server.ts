import app from '@/app.js';
import { config } from '@/shared/config/config.js';
import { connectDB, disconnectDB } from '@/shared/config/db.js';

const PORT = config.server.port;

const startServer = async (): Promise<void> => {
    await connectDB();

    const server = app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server is running on port ${PORT}`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string): void => {
        // eslint-disable-next-line no-console
        console.log(`\n${signal} received. Shutting down gracefully...`);
        server.close(() => {
            // eslint-disable-next-line no-console
            console.log('Server closed');
            void disconnectDB().finally(() => process.exit(0));
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Unhandled Rejection:', reason);
        server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (error: Error) => {
        // eslint-disable-next-line no-console
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });
};

startServer().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    void disconnectDB().finally(() => process.exit(1));
});
