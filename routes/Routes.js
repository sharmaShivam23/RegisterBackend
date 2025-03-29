const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const { signUp } = require("../controllers/userAuth");

// const csrfProtection = csrf({ cookie: true });

// CSRF Token route
// router.get('/csrf-token', csrfProtection, (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// Signup Route (Ensure CSRF Token Validation)
router.post("/signUp", signUp);
// router.post("/signUp", csrfProtection, signUp);

module.exports = router;
