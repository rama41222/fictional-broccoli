import mongoose from "mongoose";
import { StationDocument } from "../station.types";

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
            ref: 'Weatehr'
        },
        type: { 
            type: String,
            required: true 
        },
    },
    { timestamps: true }
  );

  export default mongoose.model<StationDocument>("Station", StationSchema)