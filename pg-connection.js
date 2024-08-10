const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bedbd',
  password: 'arefin',
  port: 5432,
});

module.exports = pool;
