import express from 'express';
import { publicIp } from 'public-ip';
import fetch from 'node-fetch';

const app = express();
const WEATHER_API_KEY = '385f48105fdf4d99bc4113759240207';
const FETCH_TIMEOUT = 5000; // 5 seconds timeout

// Helper function to add timeout to fetch
const fetchWithTimeout = (url, options, timeout = FETCH_TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

app.get('/api/hello', async (req, res) => {
  try {
    const ipAddress = await publicIp();
    const visitorName = req.query.visitor_name || 'Guest';

    const [ipApiResponse, weatherResponse] = await Promise.all([
      fetchWithTimeout(`https://ipapi.co/${ipAddress}/json/`),
      fetchWithTimeout(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${ipAddress}`)
    ]);

    const ipData = await ipApiResponse.json();
    const weatherData = await weatherResponse.json();

    if (weatherData.current && ipData.city && ipData.region) {
      const temperature = weatherData.current.temp_c;
      const clientLocation = `${ipData.city}, ${ipData.region}`;
      res.send({
        client_ip: ipAddress,
        location: ipData.city,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${ipData.city}`
      });
    } else {
      res.status(500).send('Error getting weather or location information');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error getting public IP address or weather information');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
