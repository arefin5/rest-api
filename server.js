const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./pg-connection');
const db = require('./mongodb-connection');

const app = express();
app.use(bodyParser.json());

// PostgreSQL route example
app.get('/postgresql-data', async (req, res) => {
  try {
    console.log("test ")
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// MongoDB route example
app.get('/mongodb-data', async (req, res) => {
  try {
    console.log("test mongodb")
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
