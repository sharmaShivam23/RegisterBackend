const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { signUp } = require("../controllers/userAuth");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 3, 
  message: {
         status: 429,
         message: "Too many registration attempts , try again after 15 minutes."
   },
	standardHeaders: true,
	legacyHeaders: false,
})

router.post("/signUp" ,limiter,signUp);


module.exports = router;
