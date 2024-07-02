const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (request, response) => {
  const ip = 
  request.headers['x-real-ip'] ||
  request.headers['x-forwarded-for'] ||
  
  request.socket.remoteAddress || '';

  return response.json({
    ip,
  })
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
