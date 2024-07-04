import express from 'express';
import { publicIp } from 'public-ip';
import fetch from 'node-fetch';

const app = express();
const WEATHER_API_KEY = '385f48105fdf4d99bc4113759240207';

app.get('/api/hello', async (req, res) => {
  try {
    const ipAddress = await publicIp();
    const visitorName = req.query.visitor_name || 'Guest';

    // Get client's location using IP API
    const ipApiResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    const ipData = await ipApiResponse.json();
    const clientLocation = `${ipData.city}, ${ipData.region}, ${ipData.country_name}`;

    // Fetch weather data for client's location from WeatherAPI
    const weatherResponse = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${clientLocation}`);
    const weatherData = await weatherResponse.json();

    if (weatherData.current) {
      const temperature = weatherData.current.temp_c;
      res.send({
        greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${clientLocation}.`,
        ipAddress: `Your public IP address is: ${ipAddress}`
      });
    } else {
      res.status(500).send('Error getting weather information');
    }
  } catch (error) {
    res.status(500).send('Error getting public IP address or weather information');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});