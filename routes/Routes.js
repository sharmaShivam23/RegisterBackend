const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { signUp } = require("../controllers/userAuth");
const { limiter } = require("../controllers/userAuth");


router.post("/signUp" ,limiter,signUp);


module.exports = router
