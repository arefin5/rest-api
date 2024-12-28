const formidableMiddleware = require('express-formidable');
require('dotenv').config();
// const configurePassport = require('./passport'); // This imports your custom configuration
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
// app.use(cors({ origin: '*' },
//   allowedHeaders: ['Content-Type']
// ));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(helmet());
app.use(Fingerprint({
  parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip],
}));
// SSLCOMMERZ credentia
const store_id = process.env.StoreID
const store_passwd = process.env.StorePassword
const is_live = false; // Change to true for live environment



// Initialize Passport


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
app.use("/api", require('./router/tourRoute'))

app.use("/api", require('./router/userRoute'))
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
app.get('/build', (req, res) => {
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Build failed');
    }
    console.log(stdout);  // Logs the success message from npm run build
    res.send('Build completed successfully!');
  });
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


const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
// const userdb = require("./model/userSchema")

// setup session
app.use(session({
  secret: "GSDGRREREGDSA",
  resave: false,
  saveUninitialized: true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

const googleClientID="20226538185-hd0nr2ach4fmrut1gfj2e1b66ijh1e3c.apps.googleusercontent.com"
const googleCientSecrate="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"
passport.use(
  new OAuth2Strategy({

    clientID:googleClientID,
    clientSecret:googleCientSecrate,
    callbackURL: "https://www.bedbd.com/auth/google/callback",
    // callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true,
    scope: ["email", "profile"]
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // const user=profile.id;
        const user = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        };
        return done(null, user);



      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google ouath login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "https://www.bedbd.com/success",
  failureRedirect: "https://www.bedbd.com/login"
  // successRedirect: "http://localhost:3000/success",
  // failureRedirect: "http://localhost:3000/login"
}))

app.get("/login/sucess", async (req, res) => {

  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user })
  } else {
    res.status(400).json({ message: "Not Authorized" })
  }
})

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect("http://localhost:3000");
  })
})


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
