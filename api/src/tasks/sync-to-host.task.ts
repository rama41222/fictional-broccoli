import  { CronJob } from 'cron';
import { bikesTransformer, fetchWeather } from './../services';
import Station from './../modules/v1/station/models/station.model';
import Weather from './../modules/v1/station/models/weather.model';
import moment from 'moment-timezone';

/**
 * Cron task to fetch records from weatehr api
 * and bike sharing api
 * 
 * The function is set to run in hourly intervals
 * 
 * Transforms data into a search friendly format
 */
const syncToHost = new CronJob('0 * * * *', async() => {
    /** Current time in EST */
    const at = moment.tz('EST');
    /** Fetch Weather records */
    const weather = await fetchWeather(process.env.WEATHER_API as string);
    /** Create a database entry */
    const newWeather = await Weather.create(weather);
    /** Fetch bike records and combine with weather information */
    const bikes = await bikesTransformer(process.env.BIKE_SHARING_API as string, newWeather._id, at);
    /** create stations in the database */
    const stations = await Station.insertMany(bikes as []);
    console.info(`stations saved!!`);
});

export default syncToHost;