import moongoose from 'mongoose';
import { config } from '@/shared/config/config.js';
import logger from '@/shared/utils/logger.js';

export const disconnectDB = async (): Promise<void> => {
    await moongoose.disconnect();
    logger.info('Disconnected from MongoDB');
};

export const connectDB = async (): Promise<void> => {
    try {
        await moongoose.connect(config.db.mongoUri);
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error('Error connecting to MongoDB', { error });
        process.exit(1);
    }
};
