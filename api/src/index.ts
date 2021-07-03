import express from 'express';
import dotenv from 'dotenv'
import { fetchWeather, fetchBikes } from './services'
import { connect, DbType } from './library/database';

dotenv.config();
const app = express();

connect(DbType.Mongo);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async(req, res) => {
    const [
        weather, 
        stations
    ] = await Promise.all([
        fetchWeather(process.env.WEATHER_API as string),
        fetchBikes(process.env.BIKE_SHARING_API as string)
    ]) ;
    res.status(200).json({ at: new Date(), weather, stations });
});

app.listen(process.env.PORT, () => {
    console.log('The application is listening on port 3000!');
});