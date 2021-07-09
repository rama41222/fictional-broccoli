import express from 'express';
import dotenv from 'dotenv';
import { connect, DbType } from './library/database';
import { syncToHost } from './tasks';
import cors from 'cors';
import v1 from './modules/v1';

/** fetch from dot env */
dotenv.config();

/** create express app */
const app = express();

/** connectes to the database */
connect(DbType.Mongo)
  .then(async (data): Promise<void> => {
    /** Start the cron tasks */
    await syncToHost.start();
  })
  .catch((e) => {
    console.error("Cron jobs can't be started :=> \n", e.message);
  });

/** Allow cors */
app.use(cors());
/** json parser */
app.use(express.json());
/** url encoded parser */
app.use(express.urlencoded({ extended: true }));
/** Adding v1 routes */
app.use(v1);

/** App server */
app.listen(process.env.PORT, () => {
  console.log('The application is listening on port 3000!');
});

/** exported for testing */
export default app;
