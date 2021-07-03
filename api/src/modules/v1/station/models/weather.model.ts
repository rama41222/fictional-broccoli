import mongoose from "mongoose";
import { WeatherDocument } from "../station.types";

const WeatherSchema = new mongoose.Schema(
  {}, 
  { strict: false, timestamps: true }
  );

  export default mongoose.model<WeatherDocument>("Weather", WeatherSchema)