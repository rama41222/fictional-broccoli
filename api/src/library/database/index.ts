import mongoDbConnect from './mongo';
import { DbType } from './enums'; 
/**
 * Common data store connector, method can be extended to any number of databases
 * It will return true when the connection is made
 * @param  {DbType} dbType
 * @returns Promise
 */
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