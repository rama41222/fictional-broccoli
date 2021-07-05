import fetch, { Response } from 'node-fetch';

/**
 * This function fetches weather data from external api
 * @uses Fetch API
 * @param  {string} url Takes a Weather api endpoint
 * @returns Promise<WeatherDocument{}>
 */
const fetchWeather = async (url: string): Promise<Response> => {
  const result = await fetch(url).catch((e: any) => {
    throw new e();
  });
  return result.json();
};

export default fetchWeather;
