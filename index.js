
const express = require('express');
const cors = require("cors");
const csrf = require('csurf');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const fileUpload = require('express-fileupload');

const app = express();


app.use(express.json());
app.use(cors())
// app.use(cookieParser());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));


// app.use(session({
//   secret: process.env.SESSION_SECRET || 'default_secret_key', 
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false, httpOnly: true }
// }));


// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);


// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


const routes = require("./routes/Routes");
app.use("/api/register", routes);

const database = require('./config/database');
database();


const { cloudinaryConnect } = require('./config/cloudinary');
cloudinaryConnect()

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Project successfully running on ${PORT}`)
});

// const express = require('express');
// const cors = require("cors");
// const csrf = require('csurf');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();
// const fileUpload = require('express-fileupload');

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'default_secret_key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
// }));

// const csrfProtection = csrf({ cookie: true });

// app.use((req, res, next) => {
//   if (req.path === '/api/register/signup' && req.method === 'POST') {
//     next();
//   } else {
//     csrfProtection(req, res, next);
//   }
// });

// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: './uploads', // Ensure this directory exists
// }));

// const routes = require("./routes/Routes");
// app.use("/api/register", routes);

// const database = require('./config/database');
// database();

// const { cloudinaryConnect } = require('./config/cloudinary');
// cloudinaryConnect();

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Project successfully running on ${PORT}`);
// });

