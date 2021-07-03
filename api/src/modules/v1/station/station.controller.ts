import { Response, Request } from 'express';

import {
  fetchRecordsByAt,
  fetchRecordsByAtById,
  fetchRecordsByDateRangeAndFrequency,
} from './station.service';
import { TimeFrequency } from './station.types';

const fetchAllStations = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  try {
    const { at, limit, skip } = req.query;

    const noOfPages = (limit ? parseInt(limit as string) : 10) as number;
    const startPage = (skip ? parseInt(skip as string) : 0) as number;

    if (!at) {
      return res
        .status(404)
        .json({ message: 'Query param missing: at or Invalid parameter: at' });
    }

    const date = new Date(at as string);
    const result = await fetchRecordsByAt(date, startPage, noOfPages);

    if (result.totalPages <= 0) {
      return res.status(404).json({ message: `No Records found for: ${date}` });
    }

    return res.status(200).json(result);
  } catch (e) {
    return res.status(409).json({ message: e.message });
  }
};

const fetchStationById = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  try {
    const { id } = req.params;
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

    const formattedId = parseInt(id as string) || -1;

    if (at) {
      const date = new Date(at as string);
      const result = await fetchRecordsByAtById(
        formattedId,
        date,
        startPage,
        noOfPages
      );
      if (result.totalPages <= 0) {
        return res
          .status(404)
          .json({ message: `No Records found for: ${date}` });
      }
      return res.status(200).json(result);
    }

    if (from && to) {
      const fromDate = new Date(from as string);
      const toDate = new Date(to as string);
      const result = await fetchRecordsByDateRangeAndFrequency(
        formattedId,
        fromDate,
        toDate,
        startPage,
        noOfPages,
        frequency as TimeFrequency
      );

      // if (result.totalPages <= 0) {
      //   return res
      //     .status(404)
      //     .json({ message: `No Records found for: ${fromDate} and ${toDate}` });
      // }
      return res.status(200).json(result);
    }
    return res.status(200).json({});
  } catch (e) {
    return res.status(409).json({ message: e.message });
  }
};

export { fetchAllStations, fetchStationById };
