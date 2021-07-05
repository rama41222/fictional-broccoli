import { fetchBikes, fetchWeather } from './../services';
import dotenv from 'dotenv';
dotenv.config();

describe('fetchBikes', () => {

    test('output', async () => {
        const bikes = await fetchBikes(process.env.BIKE_SHARING_API as string)
        expect(bikes).toBeTruthy();
        expect(bikes.features.length).toBeGreaterThanOrEqual(0);
    }, 100000);

    test('bike object', async () => {
        const bikes = await fetchBikes(process.env.BIKE_SHARING_API as string)
        expect(bikes).toBeTruthy();
        expect(bikes.features.length).toBeGreaterThanOrEqual(0);
    }, 100000);

    test('feature object', async () => {
        const bikes = await fetchBikes(process.env.BIKE_SHARING_API as string)
        const feature = bikes.features[0];
        expect(feature.properties).toBeTruthy();
        expect(feature.type).toBe("Feature");
    }, 100000);
  });

  describe('fetchWeather', () => {

    test('output', async () => {
        const weather = await fetchWeather(process.env.WEATHER_API as string)
        expect(weather).toBeTruthy();
    }, 100000);

    test('weather object keys', async () => {
        const weather = await fetchWeather(process.env.WEATHER_API as string)
        expect(weather.weather).toBeTruthy();
        expect(weather.weather.length).toBeGreaterThanOrEqual(0);
        expect(weather.id).toBeTruthy();
    }, 100000);

  });