import mongoose, { LeanDocument } from 'mongoose';
import { WeatherDocument, StationDocument, TimeFrequency } from './station.types';
import Station from './models/station.model';
import { parseWeather, parseStations } from './station.helper';

const fetchRecordsByAt = async (
  at: Date,
  startPage: number,
  noOfpages: number
): Promise<{
  at: Date;
  stations: Partial<StationDocument>[];
  weather: Partial<LeanDocument<WeatherDocument>>;
  totalPages: number;
}> => {
  const totalPages = await Station.count({ at: { $gte: at } });

  if (totalPages <= 0) {
    return { at, stations: [], weather: {}, totalPages: 0 };
  }

  const rawStations = await Station.find({ at: { $gte: at } })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: -1 });

  const tempWeather = await rawStations[0].weather.toObject();
  const timeStamp = await rawStations[0].at;
  const weather = parseWeather(tempWeather);
  const stations = parseStations(rawStations);
  return { at: timeStamp, stations, weather, totalPages };
};

const fetchRecordsByAtById = async (
  id: number,
  at: Date,
  startPage: number,
  noOfpages: number
): Promise<{
  at: Date;
  stations: Partial<StationDocument>[];
  weather: Partial<LeanDocument<WeatherDocument>>;
  totalPages: number;
}> => {
  const totalPages = await Station.count({
    stationId: id,
    at: { $gte: at },
  });

  if (totalPages <= 0) {
    return { at, stations: [], weather: {}, totalPages: 0 };
  }

  const rawStations = await Station.find({
    stationId: id,
    at: { $gte: at },
  })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: -1 });

  const tempWeather = await rawStations[0].weather.toObject();
  const timeStamp = await rawStations[0].at;
  const weather = parseWeather(tempWeather);
  const stations = parseStations(rawStations);
  return { at: timeStamp, stations, weather, totalPages };
};

const fetchRecordsByDateRangeAndFrequency = async (
  id: number,
  from: Date,
  to: Date,
  startPage: number,
  noOfpages: number,
  frequency: TimeFrequency
): Promise<{
  at: Date;
  stations: Partial<StationDocument>[];
  weather: Partial<LeanDocument<WeatherDocument>>;
  totalPages: number;
}> => {

  const totalPages = await Station.count({
    stationId: id,
    $and: [{ at: { $gte: from }}, {at:  { $lte: to }}],
  });

  if (totalPages <= 0) {
    return { at: from, stations: [], weather: {}, totalPages: 0 };
  }

  const rawStations = await Station.find({
    stationId: id,
    $and: [{ at: { $gte: from }}, {at:  { $lte: to }}],
  })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: -1 });

  const tempWeather = await rawStations[0].weather.toObject();
  const timeStamp = await rawStations[0].at;
  const weather = parseWeather(tempWeather);
  const stations = parseStations(rawStations);
  return { at: timeStamp, stations, weather, totalPages };
};

export {
  fetchRecordsByAt,
  fetchRecordsByAtById,
  fetchRecordsByDateRangeAndFrequency,
};
