const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bedbddata',
  password: 'arefin',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
  process.exit(-1);
});

// Test the connection by running a simple query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query:', err.stack);
  } else {
    console.log('Query result:', res.rows);
  }
});

module.exports = pool;
