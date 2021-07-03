import mongoDbConnect from './mongo';
import { DbType } from './enums'; 

const connect = async (dbType: DbType):  Promise<boolean> => {
    switch(dbType) {
        case DbType.Mongo: 
            return mongoDbConnect();
        default:
            console.error('Database connector not found');
            return false;
    }
} 

export {
    connect,
    DbType
};