import mongoose, { LeanDocument } from 'mongoose';
import {
  WeatherDocument,
  StationDocument,
  TimeFrequency,
} from './station.types';
import Station from './models/station.model';
import { parseWeather, parseStations } from './station.helper';
import moment from 'moment-timezone';

/**
 * This contains the business logic to filter the records by giving a specific Date.
 * @param  {moment.Moment} at
 * @param  {number} startPage
 * @param  {number} noOfpages
 * @returns {
 * Promise<
 * {at: Date;stations: Partial<StationDocument>[];
 * weather: Partial<LeanDocument<WeatherDocument>>;
 * totalPages: number;}>}
 */
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
  /** Total record count for pagination */
  const totalPages = await Station.countDocuments({
    at: { $gte: at.toDate() },
  });

  /** If no matching records return. */
  if (totalPages <= 0) {
    return { at: at.toDate(), stations: [], weather: {}, totalPages: 0 };
  }

  /** If the count is greater than 0, then fire the main query. */
  const rawStations = await Station.find({ at: { $gte: at.toDate() } })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: 1 });

  /** Since weather is common to all stations during a single snapshot,
   *  get the weatehr from initial record
   */
  const tempWeather = await rawStations[0].weather.toObject();
  /** Get the time stamp */
  const timeStamp = await rawStations[0].at;
  /** Parse the Weather */
  const weather = parseWeather(tempWeather);
  /** parse the stations, removing unwanted fields */
  const stations = parseStations(rawStations);
  return { at: timeStamp, stations, weather, totalPages };
};

/**
 * This contains the business logic to filter the records by giving a specific Date for a specific kiosk.
 * @param  {number} id kiosk id
 * @param  {moment.Moment} at moment date time
 * @param  {number} startPage pagination start page
 * @param  {number} noOfpages pagination total number of pages
 * @returns {Promise<{
 * at: Date;
 * stations: Partial<StationDocument>[];
 * weather: Partial<LeanDocument<WeatherDocument>>;
 * totalPages: number;
 * }> }
 */
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
  /** Get the matching record count */
  const totalPages = await Station.countDocuments({
    stationId: id,
    at: { $gte: at.toDate() },
  });

  /** return if zero mathing records */
  if (totalPages <= 0) {
    return { at: at.toDate(), stations: [], weather: {}, totalPages: 0 };
  }

  /** Query by kiosk id at a specific time */
  const rawStations = await Station.find({
    stationId: id,
    at: { $gte: at.toDate() },
  })
    .skip(startPage)
    .limit(noOfpages)
    .populate('weather')
    .sort({ at: 1 });

  /** Since weather is common to all stations during a single snapshot,
   *  get the weatehr from initial record
   */
  const tempWeather = await rawStations[0].weather.toObject();
  /** Get the time stamp */
  const timeStamp = await rawStations[0].at;
  /** Parse the weather */
  const weather = parseWeather(tempWeather);
  /** parse the stations, removing unwanted fields */
  const stations = parseStations(rawStations);
  return { at: timeStamp, stations, weather, totalPages };
};

/**
 * Fetches stations per kiosk id, per from-to time range of a frequency ['hourly', 'daily']
 * @param  {number} id kiosk id
 * @param  {moment.Moment} from from date
 * @param  {moment.Moment} to to date
 * @param  {TimeFrequency} frequency ['hourly', 'daily']
 * @returns {Promise<[] | Partial<StationDocument>[]>}
 */
const fetchRecordsByDateRangeAndFrequency = async (
  id: number,
  from: moment.Moment,
  to: moment.Moment,
  frequency: TimeFrequency
): Promise<[] | Partial<StationDocument>[]> => {
  /** Get the station count per station for a time range */
  const rawStations = await Station.find({
    $and: [
      { stationId: id },
      { at: { $gte: from.toDate(), $lte: to.toDate() } },
    ],
  })
    .populate('weather')
    .sort({ at: 1 });

  /** Return zero if no records */
  if (!rawStations || rawStations.length <= 0) {
    return [];
  }

  /** calculate the frequency */
  const result = await calculateFrequency(id, rawStations, from, to, frequency);

  /** if no results return an empty array */
  if (!result || result.length <= 0) {
    return [];
  }

  return result;
};

/**
 * Groups a set of records in a certain time range into ['hourly', 'daily']
 * @param  {number} id kiosk id
 * @param  {Array<Partial<StationDocument>>} rawStations Array of stations
 * @param  {moment.Moment} from from time
 * @param  {moment.Moment} to to time
 * @param  {TimeFrequency} frequency ['hourly', 'daily']
 * @returns {Promise<Partial<StationDocument>[]>}
 */
const calculateFrequency = async (
  id: number,
  rawStations: Array<Partial<StationDocument>>,
  from: moment.Moment,
  to: moment.Moment,
  frequency: TimeFrequency
): Promise<Partial<StationDocument>[]> => {
  /** store the records according to the frequency */
  const records: Partial<StationDocument>[] = [];

  if (frequency === TimeFrequency.Hourly) {
    /** parse from to the end of that hour */
    const roundedStartTime = from.endOf('hour');

    /** parse 'to' to the end of that hour */
    const roundedEndTime = to.endOf('hour');

    /** Get the hour difference between from and to */
    const hours = roundedEndTime.diff(roundedStartTime, 'hours');

    /** initialize the start time */
    let p = roundedStartTime.toDate().getTime();

    /** iterate according to number of hours */
    for (let i = 1; i <= hours; i++) {
      /** check if the station time falls between the range */
      for (const station of rawStations) {
        const z = moment.tz(station.at, 'EST').toDate().getTime();

        const x = p;

        /** add one hour in milli seconds to p to get records between 1 hour */
        const y = moment
          .tz(p + 60 * 60 * 1000, 'EST')
          .toDate()
          .getTime();

        /** if the time is inbetween, then push it to records and break
         * since only the first record has to be shown
         */
        if (x <= z && z <= y) {
          records.push(station);
          break;
        }
      }
      /** increate the time by another hour */
      p += 60 * 60 * 1000;
    }
  }

  if (frequency === TimeFrequency.Daily) {
    /** parse from to the end of that day */
    const roundedStartTime = from.endOf('day');

    /** parse to to the end of that day */
    const roundedEndTime = to.endOf('day');

    /** Get the number of days between from and to */
    const days = roundedEndTime.diff(roundedStartTime, 'days');

    /** initialize the start time in milliseconds */
    let p = roundedStartTime.toDate().getTime();

    /** iterate according to number of days */
    for (let i = 1; i <= days; i++) {
      /** check if the station time falls between the range */
      for (const station of rawStations) {
        const z = moment.tz(station.at, 'EST').toDate().getTime();

        const x = p;

        /** add one hour in milliseconds to p to get records between 1 day */
        const y = moment
          .tz(p + 60 * 60 * 1000 * 24, 'EST')
          .toDate()
          .getTime();

        /** if the time is inbetween, then push it to records and break
         * since only the first record has to be shown
         */
        if (x <= z && z <= y) {
          records.push(station);
          break;
        }
      }

      /** increate the time by another 24 hours */
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
