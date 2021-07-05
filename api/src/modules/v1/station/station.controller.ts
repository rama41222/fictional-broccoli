import { Response, Request } from 'express';
import moment from 'moment-timezone';

import {
  fetchRecordsByAt,
  fetchRecordsByAtById,
  fetchRecordsByDateRangeAndFrequency,
} from './station.service';
import { TimeFrequency } from './station.types';

/**
 * This controller will return all stations at user given date time;
 * @param  {Request} req
 * @param  {Response} res
 * @returns {Promise<Response<any>>} Returns all stations
 */
const fetchAllStations = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  try {
    /**
     * Destructure the query params
     * @param {number} limit number of Documents at a time
     * @param {number} skip which record to start from
     * @param {moment.Moment} at Date on or after
     * */
    const { at, limit, skip } = req.query;

    const noOfPages = (limit ? parseInt(limit as string) : 10) as number;
    const startPage = (skip ? parseInt(skip as string) : 0) as number;

    if (!at) {
      return res
        .status(404)
        .json({ message: 'Query param missing: at or Invalid parameter: at' });
    }

    const date = moment.tz(at as string, 'EST');
    /**  Returns Stations based on date*/
    const result = await fetchRecordsByAt(date, startPage, noOfPages);

    /**  404 if no records are found */
    if (result.totalPages <= 0) {
      return res.status(404).json({ message: `No Records found for: ${date}` });
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(409).json({ message: e.message });
  }
};

/**
 * This method will take a specific time, a time range along with a
 * frequency to return an array of stations
 * @param  {Request} req
 * @param  {Response} res
 * @returns {Promise<Response<any>>} returns stations array containing weather,
 * snapshot time and station information
 */
const fetchStationById = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  try {
    /**
     * @param {number} id kiosk id
     */
    const { id } = req.params;

    /**
     * @param {moment.Moment} at Date, on or after
     * @param {moment.Moment} from Date, from or after
     * @param {moment.Moment} to Date, to or before
     * @param {TimeFrequency} frequency ['hourly','daily']
     * @param {number} limit number of Documents at a time
     * @param {number} skip which record to start from
     */
    const {
      at,
      from,
      to,
      frequency = TimeFrequency.Hourly,
      skip,
      limit,
    } = req.query;

    const noOfPages = (limit ? parseInt(limit as string) : 10) as number;
    const startPage = (skip ? parseInt(skip as string) : 0) as number;

    /** Parse kiosk id as number */
    const formattedId = parseInt(id as string) || -1;

    /** if on or after a specific time */
    if (at) {
      const date = moment.tz(at as string, 'EST');

      /** fetch records based on kiosk id and time */
      const result = await fetchRecordsByAtById(
        formattedId,
        date,
        startPage,
        noOfPages
      );

      /**  404 if no records are found */
      if (result.totalPages <= 0) {
        return res
          .status(404)
          .json({ message: `No Records found for: ${date}` });
      }
      return res.status(200).json(result);
    }

    /** If between a time range */
    if (from && to) {
      const fromDate = moment.tz(from as string, 'EST');
      const toDate = moment.tz(to as string, 'EST');

      /** fetch records based on kiosk id and time range and frequency */
      const result = await fetchRecordsByDateRangeAndFrequency(
        formattedId,
        fromDate,
        toDate,
        frequency as TimeFrequency
      );

      /**  404 if no records are found */
      if (result.length <= 0) {
        return res
          .status(404)
          .json({ message: `No Records found for: ${fromDate} and ${toDate}` });
      }
      return res.status(200).json(result);
    }

    return res
      .status(404)
      .json({ message: `No Records found for: ${fromDate} and ${toDate}` });
  } catch (e) {
    return res.status(409).json({ message: e.message });
  }
};

export { fetchAllStations, fetchStationById };
