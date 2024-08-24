const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./pg-connection');
const db = require('./mongodb-connection');
const cors = require('cors');

const app = express();
var Fingerprint = require("express-fingerprint");

app.use(bodyParser.json());

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

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
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: '1.0.0',
    },
  },
  apis: ["server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


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

