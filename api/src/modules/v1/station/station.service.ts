import mongoose, { LeanDocument } from 'mongoose';
import {
  WeatherDocument,
  StationDocument,
  TimeFrequency,
} from './station.types';
import Station from './models/station.model';
import { parseWeather, parseStations } from './station.helper';
import moment from 'moment-timezone';

const fetchRecordsByAt = async (
  at: moment.Moment,
  startPage: number,
  noOfpages: number
): Promise<{
  at: Date;
  stations: Partial<StationDocument>[];
  weather: Partial<LeanDocument<WeatherDocument>>;
  totalPages: number;
}> => {
  const totalPages = await Station.countDocuments({
    at: { $gte: at.toDate() },
  });

  if (totalPages <= 0) {
    return { at: at.toDate(), stations: [], weather: {}, totalPages: 0 };
  }

  const rawStations = await Station.find({ at: { $gte: at.toDate() } })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: 1 });

  const tempWeather = await rawStations[0].weather.toObject();
  const timeStamp = await rawStations[0].at;
  const weather = parseWeather(tempWeather);
  const stations = parseStations(rawStations);
  return { at: timeStamp, stations, weather, totalPages };
};

const fetchRecordsByAtById = async (
  id: number,
  at: moment.Moment,
  startPage: number,
  noOfpages: number
): Promise<{
  at: Date;
  stations: Partial<StationDocument>[];
  weather: Partial<LeanDocument<WeatherDocument>>;
  totalPages: number;
}> => {
  const totalPages = await Station.countDocuments({
    stationId: id,
    at: { $gte: at.toDate() },
  });

  if (totalPages <= 0) {
    return { at: at.toDate(), stations: [], weather: {}, totalPages: 0 };
  }

  const rawStations = await Station.find({
    stationId: id,
    at: { $gte: at.toDate() },
  })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: 1 });

  const tempWeather = await rawStations[0].weather.toObject();
  const timeStamp = await rawStations[0].at;
  const weather = parseWeather(tempWeather);
  const stations = parseStations(rawStations);
  return { at: timeStamp, stations, weather, totalPages };
};

const fetchRecordsByDateRangeAndFrequency = async (
  id: number,
  from: moment.Moment,
  to: moment.Moment,
  frequency: TimeFrequency
): Promise<[] | Partial<StationDocument>[]> => {

  const rawStations = await Station.find({
    $and: [
      { stationId: id },
      { at: { $gte: from.toDate(), $lte: to.toDate() } },
    ],
  })
    .populate('weather')
    .sort({ at: 1 });

  if (!rawStations || rawStations.length <= 0) {
    return [];
  }

  const result = await calculateFrequency(id, rawStations, from, to, frequency);
  
  if (!result || result.length <= 0) {
    return [];
  }

  return result;
};

const calculateFrequency = async (
  id: number,
  rawStations: Array<Partial<StationDocument>>,
  from: moment.Moment,
  to: moment.Moment,
  frequency: TimeFrequency
): Promise<Partial<StationDocument>[]> => {
  const records: Partial<StationDocument>[] = [];

  if (frequency === TimeFrequency.Hourly) {
    const roundedStartTime = from.endOf('hour');
    const roundedEndTime = to.endOf('hour');
    const hours = roundedEndTime.diff(roundedStartTime, 'hours');

    let p = roundedStartTime.toDate().getTime();
    for (let i = 1; i <= hours; i++) {
      for (const station of rawStations) {
        const z = moment.tz(station.at, 'EST').toDate().getTime();
        const x = p;
        const y = moment
          .tz(p + 60 * 60 * 1000, 'EST')
          .toDate()
          .getTime();
        if (x <= z && z <= y) {
          records.push(station);
          break;
        }
      }
      p += 60 * 60 * 1000;
    }
  }

  if (frequency === TimeFrequency.Daily) {
    const roundedStartTime = from.endOf('day');
    const roundedEndTime = to.endOf('day');
    const days = roundedEndTime.diff(roundedStartTime, 'days');
    let p = roundedStartTime.toDate().getTime();
    for (let i = 1; i <= days; i++) {
      for (const station of rawStations) {
        const z = moment.tz(station.at, 'EST').toDate().getTime();
        const x = p;
        const y = moment
          .tz(p + 60 * 60 * 1000 * 24, 'EST')
          .toDate()
          .getTime();
        if (x <= z && z <= y) {
          records.push(station);
          break;
        }
      }
      p += 60 * 60 * 1000 * 24;
    }
  }
  return records;
};

export {
  fetchRecordsByAt,
  fetchRecordsByAtById,
  fetchRecordsByDateRangeAndFrequency,
};
