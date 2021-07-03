import { Router } from 'express';
import  stationRouter from './stations/station.routes';

const v1 = Router();
const version = 'v1';

v1.use(`/${version}/stations`, stationRouter);

export default v1;