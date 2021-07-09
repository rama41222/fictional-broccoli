import mongoose from 'mongoose';
import { StationDocument } from '../station.types';
import Weather from './weather.model';

/**
 * Station Schema
 * @param  {mongoose.Schema.Types.Mixed} {properties
 * @param  {mongoose.Schema.Types.Mixed} geometry
 * @param  {{type:Number} stationId
 * @param  {true}} required
 * @param  {{type:String} weather
 * @param  {Weather}} ref
 * @param  {{type:String} type
 * @param  {true}} required
 * @param  {{type:Date} at
 * @param  {true}}} required
 * @param  {true}} {timestamps
 */
const StationSchema = new mongoose.Schema(
  {
    properties: mongoose.Schema.Types.Mixed,
    geometry: mongoose.Schema.Types.Mixed,
    stationId: {
      type: Number,
      required: true,
    },
    weather: {
      type: String,
      ref: Weather,
    },
    type: {
      type: String,
      required: true,
    },
    at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<StationDocument>('Station', StationSchema);
