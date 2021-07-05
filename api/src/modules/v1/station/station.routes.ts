import { Router } from 'express';
import { fetchAllStations, fetchStationById } from './station.controller';

const stationRouter = Router();

/**
 * Station specific routes
 */
stationRouter.get('/:id', fetchStationById);
stationRouter.get('/', fetchAllStations);

export default stationRouter;