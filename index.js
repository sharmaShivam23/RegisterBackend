
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
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
}));


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads',
}));

const routes = require("./routes/Routes");
app.use("/api/register", routes);

const database = require('./config/database');
database();

const { cloudinaryConnect } = require('./config/cloudinary');
cloudinaryConnect();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Project successfully running on ${PORT}`);
});

