import mongoose from 'mongoose';
import { WeatherDocument } from '../station.types';

/**
 * Open Weather Schema
 * @param  {} {}
 * @param  {false} {strict
 * @param  {true}} timestamps
 */
const WeatherSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);

export default mongoose.model<WeatherDocument>('Weather', WeatherSchema);
