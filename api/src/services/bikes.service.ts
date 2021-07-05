
import moment from 'moment-timezone';
import fetch, { Response } from 'node-fetch';
import { TransformType } from './types.service';

/**
 * This function will fetch stations using bike sharing API
 * @param  {string} url Takes a bike sharing api endpoint
 * @returns Promise<Partial<StationDocument>[]>
 */
const fetchBikes = async (url: string): Promise<any> => {
  const result = await fetch(url).catch((e: any) => {
    throw new e();
  });
  return result.json();
};

/**
 * ``` 
 *  Returns weather data in the following format
 * { feature,
 *  stationId: feature.properties.id,
 *  weather,
 *  at: at.toDate()
 * }
 * ```
 * @param  {TransformType} data @type Partial<StationDocument>[]
 * @param  {string} weather weather document uuid
 * @param  {moment.Moment} at date of the snapshot
 * @returns Promise<void | Record<string, any>>
 */
const bikesTransformer = async (
  data: TransformType,
  weather: string,
  at: moment.Moment
): Promise<void | Record<string, any>> => {
  try {
    /** Fetch bikes from bike sharing api */
    const { features } = await fetchBikes(
      process.env.BIKE_SHARING_API as string
    );

    /** process only if the length is  > 0 */
    if (features.length > 0) {
      /** Mapping data according to a custom format */
      const entities = features.map((feature: Record<string, any>) => {
        if (feature.properties.id) {
          return {
            ...feature,
            stationId: feature.properties.id,
            weather,
            at: at.toDate(),
          };
        }
      });
      return entities;
    }
    /** If empty return an empty array */
    return [];
  } catch (e) {
    console.error('e', e.message);
    return e;
  }
};

export { fetchBikes, bikesTransformer };
