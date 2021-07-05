const {
    fetchBikes,
    bikesTransformer,
    fetchWeather
} = require('./../services')
const dotenv = require('dotenv');
dotenv.config();

// beforeAll(async () => {
// })

// test('ab', async() => {
//     const bikes = await fetchBikes(process.env.BIKE_SHARING_API as string)
//     console.log('sdsd', bikes )
// })