import { Router } from 'express';
import stationRouter from './station/station.routes';

const v1 = Router();
const version = 'v1';

/**
 * v1 routes
 */
v1.use(`/${version}/stations`, stationRouter);

export default v1;
