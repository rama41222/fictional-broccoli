import express from 'express';
import dotenv from 'dotenv'
import { fetchWeather, fetchBikes } from './services'
import { connect, DbType } from './library/database';
import { syncToHost } from './tasks' 
import v1 from './modules/v1';

dotenv.config();
const app = express();

connect(DbType.Mongo).then(data => {
    syncToHost.start();
}).catch(e => {
    console.error('Cron jobs can\'t be started :=> \n', e.message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(v1);

app.listen(process.env.PORT, () => {
    console.log('The application is listening on port 3000!');
});
