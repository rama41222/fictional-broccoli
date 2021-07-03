import mongoose from 'mongoose';

const mongoDbConnect = async (): Promise<void> => {
    mongoose.connect(process.env.DB_ENDPOINT as string, {
        useNewUrlParser: true,
         useUnifiedTopology: true
    }).then(() => {
        console.info('Successfully connected to mongodb');
    }).catch(e => {
        console.error('Connection Error:=> \n', e.message);
    })
}

export default mongoDbConnect;