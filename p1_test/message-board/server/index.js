const express = require('express');
const cors = require('cors');
const redis = require('redis');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Redis client setup
const client = redis.createClient({
  host: 'redis',
  port: 6379
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});