const formidableMiddleware = require('express-formidable');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const yaml = require('yamljs');
const swaggerUI = require('swagger-ui-express');
const helmet = require('helmet');
const Fingerprint = require("express-fingerprint");
 const db = require('./mongodb-connection');
 const SSLCommerzPayment = require('sslcommerz-lts')
 const socketIO = require('socket.io');
 const http = require('http');
// Initialize Express app
const app = express();

const server = http.createServer(app);
// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(Fingerprint({
  parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip],
}));
// SSLCOMMERZ credentials
const store_id =process.env.StoreID
const store_passwd =process.env.StorePassword
const is_live = false; // Change to true for live environment
app.use((req, res, next) => {
  req.sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  next();
});
const swaggerDocument = yaml.load('./swagger.yaml');

// Set up Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Define API routes
app.use('/api', require('./router/authRouter'));
app.use('/api', require('./router/hostRoute'));
app.use('/api', require('./router/adminRoute'));

app.use("/api",require('./router/userRoute'))
app.use('/api', require('./router/getImage'));
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
const io = socketIO(server, {
  cors: {
    origin: '*', // Allow any origin (or restrict to your frontend origin)
    methods: ['GET', 'POST'],
  }
});
require('./socketHandler')(io); // Load socket handle
// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
