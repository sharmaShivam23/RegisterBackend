const express = require('express')
const router = express.Router()
const csrf = require('csurf');
const {signUp} = require("../controllers/userAuth")

const csrfProtection = csrf({ cookie: true });

router.post("/signUp",csrfProtection,signUp)




module.exports = router


