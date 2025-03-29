const express = require('express');
const router = express.Router();
const { signUp } = require("../controllers/userAuth");


router.post("/signUp", signUp);


module.exports = router;
