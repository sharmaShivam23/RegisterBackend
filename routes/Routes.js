const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { signUp } = require("../controllers/userAuth");
const { limiter } = require("../controllers/userAuth");
const { sendOTP } = require("../controllers/userAuth");


router.post("/signUp" ,limiter,signUp);
router.post("/otp" , sendOTP);


module.exports = router
