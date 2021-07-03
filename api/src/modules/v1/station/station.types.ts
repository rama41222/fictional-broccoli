import mongoose from 'mongoose';
interface StationResponse {
    at: string;
    weather: Record<string, unknown>;
    stations: Record<string, unknown>; 
}
interface WeatherDocument extends mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}
interface StationDocument extends mongoose.Document {
    geometry: Record<string, any>;
    properties: Record<string, any>;
    weather: WeatherDocument; 
    stationId: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}
  

export {
    StationResponse,
    StationDocument,
    WeatherDocument
}