import { Response, Request } from 'express';
import { fetchWeather, bikesTransformer } from '../../../services';
import Station from './models/station.model';
import { StationDocument } from './station.types';

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

  const rawStations = await Station.find({ createdAt: { $gte: date } })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ createdAt: -1 });
  const totalPages = await Station.count({ createdAt: { $gte: date } });
  const weather = await rawStations[0].weather.toObject();
  Reflect.deleteProperty(weather, '__v');       
  Reflect.deleteProperty(weather, '_id');
  Reflect.deleteProperty(weather, 'createdAt');
  Reflect.deleteProperty(weather, 'updatedAt');
  const stations = rawStations.map(({ geometry, properties, type }: StationDocument) => ({
    geometry,
    properties,
    type,
  }));
  return res.status(200).json({ at, stations , weather, total: totalPages });
};

const fetchStationById = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  const { id } = req.params;
  return res.status(200).json({});
};

export { fetchAllStations, fetchStationById };


