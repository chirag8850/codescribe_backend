import moongoose from 'mongoose';
import { config } from '@/shared/config/config.js';

export const disconnectDB = async (): Promise<void> => {
    await moongoose.disconnect();
    // eslint-disable-next-line no-console
    console.log('Disconnected from MongoDB');
};

export const connectDB = async (): Promise<void> => {
    try {
        await moongoose.connect(config.db.mongoUri);
        // eslint-disable-next-line no-console
        console.log('Connected to MongoDB');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
