import { Response, Request } from "express";
import { fetchWeather, bikesTransformer } from "../../../services";
import Station from './models/station.model';
import Weather from './models/weather.model';

const fetchStations = async (req: Request, res: Response): Promise<Response<any>> => {
    const weather = await fetchWeather(process.env.WEATHER_API as string);
    const newWeather = await Weather.create(weather);
    const bikes = await bikesTransformer(process.env.BIKE_SHARING_API as string, newWeather._id);
    const stations = await Station.insertMany(bikes as []);
    return res.status(200).json({ stations });
} 

export {
    fetchStations
}
