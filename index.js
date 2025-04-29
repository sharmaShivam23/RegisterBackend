
// const express = require('express');
// const cors = require("cors");
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();
// const fileUpload = require('express-fileupload');
// const xss = require("xss-clean");
// const helmet = require("helmet");
// const hpp = require("hpp");
// const rateLimit = require("express-rate-limit");

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use(helmet());

// app.use(xss());

// app.use(hpp());

// app.use(cors({
//   origin: [
//     "https://new-cccc.vercel.app",
//     "http://127.0.0.1:5500",
//     "http://localhost:5500",
//     "http://localhost:5173",
//     "http://localhost:5174",
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

// // app.use(session({
// //   secret: process.env.SESSION_SECRET,
// //   resave: false,
// //   saveUninitialized: true,
// //   cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
// // }));


// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: './uploads',
// }));

// const routes = require("./routes/Routes");
// app.use("/api/register", routes);

// const database = require('./config/database');
// database();


// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Project successfully running on ${PORT}`);
// });


const express = require('express');
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(helmet());


app.use(xss());


app.use(hpp());


app.use(cors({
  origin: [
    "https://new-cccc.vercel.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads',
}));


// const limiter = rateLimit({
//   windowMs: 15 * 60,
//   max: 2,
//   message: {
//     status: 429,
//     message: "Too many requests , please try again after an hour"
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);
const limiter = rateLimit({
  windowMs: 15 * 1000, 
  max: 3, 
  message: {
    status: 429,
    message: "Too many registration attempts from this IP, try again after an hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (Array.isArray(ip)) {
      return ip[0];
    }
    return ip;
  }
});
// app.use();


const routes = require("./routes/Routes");
app.use("/api/register",limiter, routes);


const database = require('./config/database');
database();


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Project successfully running on ${PORT}`);
});
