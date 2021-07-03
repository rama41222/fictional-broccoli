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
  const { at, limit, skip } = req.query;

  const noOfPages = (limit ? parseInt(limit as string) : 10) as number;
  const startPage = (skip ? parseInt(skip as string) : 0) as number;
  const date = new Date(at as string);

  if (!date) {
    return res
      .status(404)
      .json({ message: 'Query param missing: at or Invalid parameter: at' });
  }

  const result = await fetchRecordsByAt(date, startPage, noOfPages);

  if (result.totalPages <= 0) {
    return res.status(404).json({ message: `No Records found for: ${date}` });
  }

  return res.status(200).json(result);
};

const fetchStationById = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
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

  const date = new Date(at as string);
  const formattedId = parseInt(id as string) || -1;

  if (date) {
    const result = await fetchRecordsByAtById(
      formattedId,
      date,
      startPage,
      noOfPages
    );
    if (result.totalPages <= 0) {
      return res.status(404).json({ message: `No Records found for: ${date}` });
    }
    return res.status(200).json(result);
  }

  const fromDate = new Date(from as string);
  const toDate = new Date(to as string);

  if (fromDate && toDate) {
    const result = await fetchRecordsByDateRangeAndFrequency(
      formattedId,
      fromDate,
      toDate,
      startPage,
      noOfPages,
      frequency as TimeFrequency
    );

    if (result.totalPages <= 0) {
      return res.status(404).json({ message: `No Records found for: ${date}` });
    }
    return res.status(200).json(result);
  }
  return res.status(200).json({});
};

export { fetchAllStations, fetchStationById };
