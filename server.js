import express from 'express';
import { publicIp } from 'public-ip';

const app = express();

app.get('/', async (req, res) => {
  try {
    const ipAddress = await publicIp();
    res.send(`Your public IP address is: ${ipAddress}`);
  } catch (error) {
    res.status(500).send('Error getting public IP address');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});