import mongoose from "mongoose";
import { StationDocument } from "../station.types";
import Weather from './weather.model';

const StationSchema = new mongoose.Schema(
    {
        properties: mongoose.Schema.Types.Mixed,
        geometry: mongoose.Schema.Types.Mixed,
        stationId: { 
            type: Number, 
            required: true 
        },
        weather: {
            type: String,
            ref: Weather
        },
        type: { 
            type: String,
            required: true 
        },
        at: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
  );

  export default mongoose.model<StationDocument>("Station", StationSchema)