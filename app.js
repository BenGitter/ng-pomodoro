// Dependencies
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

// App
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ msg: 'API Endpoint' });
});

// Serve static frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start app on port 3000
app.listen(3000, () => {
  console.log('App started');
});
