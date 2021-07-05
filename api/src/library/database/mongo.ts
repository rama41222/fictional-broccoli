import mongoose from 'mongoose';

/**
 * Mongodb connector
 * @returns Promise<boolean>
 */
const mongoDbConnect = async (): Promise<boolean> => {
    return mongoose.connect(process.env.DB_ENDPOINT as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.info('Successfully connected to mongodb');
        return Promise.resolve(true);
    }).catch(e => {
        console.error('Connection Error:=> \n', e.message);
        return Promise.reject(false);
    });
}

export default mongoDbConnect;