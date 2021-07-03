import { Response, Request } from 'express';
import Station from './models/station.model';
import { parseWeather, parseStations } from './station.service';

const fetchAllStations = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  const { at, limit, skip } = req.query;

  const noOfpages = (limit ? parseInt(limit as string) : 10) as number;
  const startPage = (skip ? parseInt(skip as string) : 0) as number;

  if (!at) {
    return res.status(404).json({ message: 'Query param missing: at' });
  }

  const date = new Date(at as string);

  if (!date) {
    return res.status(404).json({ message: 'Invalid parameter: at' });
  }

  const totalPages = await Station.count({ createdAt: { $gte: date } });

  if (totalPages <= 0) {
    return res.status(404).json({ message: `No records found for at: ${at}` });
  }

  const rawStations = await Station.find({ createdAt: { $gte: date } })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ createdAt: -1 });

  const weather = parseWeather(await rawStations[0].weather.toObject());
  const stations = parseStations(rawStations);

  return res.status(200).json({ at, stations, weather, total: totalPages });
};

const fetchStationById = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  const { id } = req.params;
  return res.status(200).json({});
};

export { fetchAllStations, fetchStationById };
