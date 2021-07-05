import mongoose, { LeanDocument } from 'mongoose';
import { WeatherDocument, StationDocument } from './station.types';

/**
 * Helps to parse a weather document and to remove all the unnecessary fields
 * @param  {LeanDocument<WeatherDocument>} weather Weather Document
 * @returns {Partial<LeanDocument<WeatherDocument>> } Weather Document
 */
const parseWeather = (weather: LeanDocument<WeatherDocument>): Partial<LeanDocument<WeatherDocument>> => {
  Reflect.deleteProperty(weather, '__v');
  Reflect.deleteProperty(weather, '_id');
  Reflect.deleteProperty(weather, 'createdAt');
  Reflect.deleteProperty(weather, 'updatedAt');
  return weather;
};

/**
 * This method transforms a raw stations array into an array of required properties
 * @param  {StationDocument[]} stations
 * @returns {Array<Partial<StationDocument>>} formatted stations array
 */
const parseStations = (stations: StationDocument[]) : Array<Partial<StationDocument>> => {
  return stations.map(({ geometry, properties, type }: StationDocument) => ({
    geometry,
    properties,
    type,
  }));
};

export { parseWeather, parseStations };
