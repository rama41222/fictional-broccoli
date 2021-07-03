import  { CronJob } from 'cron';

const syncToHost = new CronJob('*/1 * * * * *', () => {
    console.log("cron ran")
});

export default syncToHost;