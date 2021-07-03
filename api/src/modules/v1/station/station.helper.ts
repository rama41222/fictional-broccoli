import mongoose, { LeanDocument } from 'mongoose';
import { WeatherDocument, StationDocument } from './station.types';

const parseWeather = (weather: LeanDocument<WeatherDocument>): Partial<LeanDocument<WeatherDocument>> => {
  Reflect.deleteProperty(weather, '__v');
  Reflect.deleteProperty(weather, '_id');
  Reflect.deleteProperty(weather, 'createdAt');
  Reflect.deleteProperty(weather, 'updatedAt');
  return weather;
};

const parseStations = (stations: StationDocument[]) : Array<Partial<StationDocument>> => {
  return stations.map(({ geometry, properties, type }: StationDocument) => ({
    geometry,
    properties,
    type,
  }));
};

export { parseWeather, parseStations };
