import fetch, { Response } from 'node-fetch';

const fetchWeather = async (url: string): Promise<Response> => {
    const result = await fetch(url).catch((e: any) => {
        throw new e;
    }); 
    return result.json();
}

export default fetchWeather;