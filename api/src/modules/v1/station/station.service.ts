import mongoose, { LeanDocument } from 'mongoose';
import { WeatherDocument, StationDocument, TimeFrequency } from './station.types';
import Station from './models/station.model';
import { parseWeather, parseStations } from './station.helper';
import moment from 'moment';

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
  const totalPages = await Station.countDocuments({ at: { $gte: at } });

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
  const totalPages = await Station.countDocuments({
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
) => {

  // const totalPages = await Station.countDocuments({
  //   stationId: id,
  //   $and: [{ at: { $gte: from }}, { at:  { $lte: to }}],
  // });

  // if (totalPages <= 0) {
  //   return { at: from, stations: [], weather: {}, totalPages: 0 };
  // }

  const rawStations = await Station.find({
    stationId: id,
    $and: [{ at: { $gte: from }}, {at:  { $lte: to }}],
  })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: -1 });

  // const tempWeather = await rawStations[0].weather.toObject();
  // const timeStamp = await rawStations[0].at;
  // const weather = parseWeather(tempWeather);
  // const stations = parseStations(rawStations);
  const result = await calculateFrequency(id, rawStations, from, to, frequency);
  return result;
};

const calculateFrequency = async (id: number,rawStations: Array<Partial<StationDocument>>, from: Date , to: Date, frequency: TimeFrequency) => {
 
  const a = moment(from);
  const b = moment(to);
  const records: Partial<StationDocument>[] = []
  console.log('frequency', frequency)
  if (frequency === TimeFrequency.Hourly) {
    console.log('in hours');

    const roundedStartTime = a.endOf('hour');
    const roundedEndTime = b.endOf('hour');
    const hours = roundedEndTime.diff(roundedStartTime, 'hours');
    console.log('roundedStartTime', roundedStartTime);
    console.log('roundedEndTime', roundedEndTime);
    console.log('hours', hours);
    
    for(let i = 1; i <= hours; i++) {
      console.log(i);
      rawStations.find(station => {
        const time = moment(station.at);
        if (time.isBetween(roundedStartTime, roundedStartTime.add('hours', 1))) {
          console.log('station', station.at)
          records.push(station);
        }
      })
    }
  }

  if (frequency === TimeFrequency.Daily) {
    
    const roundedStartTime = a.endOf('days');
    const roundedEndTime = b.endOf('days');
    const days = roundedEndTime.diff(roundedStartTime, 'days');
    for(let i = 1; i <= days; i++) {
      console.log(i);
      rawStations.find(station => {
        const time = moment(station.at);
        if (time.isBetween(roundedStartTime, roundedStartTime.add('days', 1))) {
          console.log('station', station.at)
          records.push(station);
        }
      })
    }
  }

  return records;
  
}

export {
  fetchRecordsByAt,
  fetchRecordsByAtById,
  fetchRecordsByDateRangeAndFrequency,
};
