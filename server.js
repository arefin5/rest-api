const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./pg-connection');
const db = require('./mongodb-connection');

const app = express();
app.use(bodyParser.json());

// PostgreSQL route example
app.get('/postgresql-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// MongoDB route example
app.get('/mongodb-data', async (req, res) => {
  try {
    const yourCollection = db.collection('your_collection');
    const data = await yourCollection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
