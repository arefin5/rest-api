const formidableMiddleware = require('express-formidable');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const yaml = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const helmet = require('helmet');
const Fingerprint = require("express-fingerprint");
 const db = require('./mongodb-connection');
// Initialize Express app
const app = express();


// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(Fingerprint({
  parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip],
}));
// app.use(formidableMiddleware({
//   encoding: 'utf-8',
//   multiples: true, // req.files to be arrays of files
// }))
// Load Swagger documentation from YAML file
const swaggerDocument = yaml.load('./swagger.yaml');

// Set up Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Define API routes
app.use('/api', require('./router/authRouter'));
// app.use('/api', require('./router/imageRouter'));
const imageRouter = require('./router/imageRouter');

app.use('/api/images', formidableMiddleware({ encoding: 'utf-8', multiples: true }), imageRouter);

// Example routes
app.get('/fingerprint', (req, res) => {
  const fingerprint = req.fingerprint;
  const clientIp = req.clientIp;
  res.json({ fingerprint, clientIp });
});
app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } else {
    next();
  }
});


app.get('/postgresql-data', async (req, res) => {
  try {
    console.log("test");
    res.send('PostgreSQL Data');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/mongodb-data', async (req, res) => {
  try {
    console.log("test mongodb");
    res.send('MongoDB Data');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
