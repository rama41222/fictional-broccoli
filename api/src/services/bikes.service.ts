import fetch, { Response } from 'node-fetch';
import { TransformType } from './types.service';

const fetchBikes = async (url: string): Promise<any> => {
  const result = await fetch(url).catch((e: any) => {
    throw new e();
  });
  return result.json();
};

const bikesTransformer = async (
  data: TransformType,
  weather: string,
  at: Date
): Promise<void | Record<string, any>> => {
  try {
    const { features } = await fetchBikes(
      process.env.BIKE_SHARING_API as string
    );
    if (features.length > 0) {
      const entities = features.map((feature: Record<string, any>) => {
        if (feature.properties.id) {
          return {
            ...feature,
            stationId: feature.properties.id,
            weather,
            at
          };
        }
      });
      return entities;
    }
    return [];
  } catch (e) {
    console.error('e', e.message);
    return e;
  }
};

export { fetchBikes, bikesTransformer };
