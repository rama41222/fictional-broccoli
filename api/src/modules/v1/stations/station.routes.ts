import { Router } from 'express';
import { fetchStations } from './station.controller';

const stationRouter = Router();

stationRouter.get('/', fetchStations);

export default stationRouter;