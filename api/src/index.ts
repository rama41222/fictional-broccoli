import express from 'express';
import dotenv from 'dotenv'
import { fetchWeather } from './services'

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async(req, res) => {
    const data = await fetchWeather(process.env.WEATHER_API as string);
    res.status(200).json(data);
});

app.listen(process.env.PORT, () => {
    console.log('The application is listening on port 3000!');
});