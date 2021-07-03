import  { CronJob } from 'cron';
import { bikesTransformer, fetchWeather } from './../services';
import Station from './../modules/v1/station/models/station.model'
import Weather from './../modules/v1/station/models/weather.model'

const syncToHost = new CronJob('* * * * *', async() => {
    // const weather = await fetchWeather(process.env.WEATHER_API as string);
    // const newWeather = await Weather.create(weather);
    // const bikes = await bikesTransformer(process.env.BIKE_SHARING_API as string, newWeather._id);
    // const stations = await Station.insertMany(bikes as []);
    console.log(`stations saved!!`);
});

export default syncToHost;