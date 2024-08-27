const express = require('express');
const bodyParser = require('body-parser');
// const pool = require('./pg-connection');
const db = require('./mongodb-connection');
const cors = require('cors');
const yaml = require('yamljs');
const swaggerUI = require('swagger-ui-express');

const app = express();
var Fingerprint = require("express-fingerprint");

app.use(bodyParser.json());


app.use(
  Fingerprint({
    parameters: [
      // Defaults
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip,
    ],
  })
);
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Endpoint to get device fingerprint
app.get("/fingerprint", (req, res) => {
  const fingerprint = req.fingerprint;
  const clientIp = req.clientIp;
  res.json({ fingerprint, clientIp });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const helmet = require('helmet');
app.use(helmet());


// Load Swagger documentation from YAML file
const swaggerDocument = yaml.load('./swagger.yaml');
// Set up Swagger UI to serve the Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/api',require("./router/authRouter"));

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

