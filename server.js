
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const ipAddress = req.ip;
  res.send(`Your IP address is: ${ipAddress}`);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});