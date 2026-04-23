const express = require('express');
const cors = require('cors');
const searchRoute = require('./routes/search');
const locateRoute = require('./routes/locate');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MedBridge API Running — v2');
});

app.get('/api/search', (req, res) => {
  res.status(405).json({ error: 'Use POST request for /api/search' });
});

app.use('/api', searchRoute);
app.use('/api', locateRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[GlobalError]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(5000, () => {
  console.log('MedBridge server v2 running on http://localhost:5000');
});
