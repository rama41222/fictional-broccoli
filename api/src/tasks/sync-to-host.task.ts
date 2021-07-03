import  { CronJob } from 'cron';

const syncToHost = new CronJob('*/10 * * * * *', () => {
    console.log("cron ran")
});

export default syncToHost;