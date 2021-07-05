import React from "react";
import { ApiRequestData, Frequency } from "../dashboard.types";

// const API_ENDPOINT = "http://localhost:3000/v1/stations";
const API_ENDPOINT = "http://ec2-52-66-213-231.ap-south-1.compute.amazonaws.com/api/v1/stations";

/**
 * @param  {Date} at Query data from
 */
const queryStationByAt = async ({ at }: ApiRequestData): Promise<any> => {
  const data = await fetch(`${API_ENDPOINT}?at=${at}`).catch((e) => {
    throw new Error("API Error");
  });

  return data.json();
};

/**
 * @param  {string} id kiosk id
 * @param  {Date} from? from time
 * @param  {Date} to? to time
 * @param  {Date} at? specific time
 * @param  {Frequency=Frequency.Hourly} frequency
 * @returns Promise
 */
const queryStationById = async ({ id, from, to, frequency  }: ApiRequestData): Promise<any> => {
  let queryString = `${id}`;

  if (from && to) {
    queryString = `${queryString}?from=${from}&to=${to}&frequency=${frequency}`;
  }

  const data = await fetch(`${API_ENDPOINT}/${queryString}`).catch((e) => {
    throw new Error("API Error");
  });

  return data.json();
};

export { queryStationById, queryStationByAt };
