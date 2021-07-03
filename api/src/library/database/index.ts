import mongoDbConnect from './mongo';
import { DbType } from './enums'; 

const connect = async (dbType: DbType):  Promise<void> => {
    switch(dbType) {
        case DbType.Mongo: 
            return mongoDbConnect();
        default:
            console.error('Database connector not found');
    }
} 

export {
    connect,
    DbType
};