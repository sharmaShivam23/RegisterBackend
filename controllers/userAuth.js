const user = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Tools/sendEmail');
const axios = require('axios')
const fs = require('fs')
const path  = require('path')

exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, dob, confirmPassword, selectedRole , recaptchaValue } = req.body;
    
    if (!recaptchaValue) {
      return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
    }

    
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const secretKey = process.env.SECRET_KEY;

    const recaptchaResponse = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaValue,
      },
    });

    if (!recaptchaResponse.data.success) {
      return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
    }
    
    if (!firstName || !lastName || !email || !password || !phoneNumber || !confirmPassword || !selectedRole) {
      return res.status(400).send({ success: false, message: "All details are required" });
    }
    if (firstName.length < 3 || lastName.length < 3) {
      return res.status(400).send({ success: false, message: "Name must be at least 3 characters long" });
    }
    if (password.length < 6) {
      return res.status(400).send({ success: false, message: "Password should be at least 6 characters long" });
    }
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      return res.status(400).send({ success: false, message: "Phone number should be exactly 10 digits" });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({ success: false, message: "Passwords do not match" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ success: false, message: "Invalid email format" });
    }

    const existEmail = await user.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ success: false, message: "Email already exists" });
    }

    
    const hashpassword = await bcrypt.hash(password, 10);

    const userCreate = await user.create({
      firstName,
      lastName,
      email,
      password: hashpassword,
      phoneNumber,
      dob,
      selectedRole
    });

    
    const templatePath = path.join(__dirname, '../Templates/signup.html');
    if (!fs.existsSync(templatePath)) {
      return res.status(500).send({
        success: false,
        message: "signup template not found.",
      });
    }
    const signupTemplate = fs.readFileSync(templatePath, 'utf8');

    
    const subject = "Welcome to Our Platform!";
    const text = `Hi ${firstName}, Congratulations! Your account has been created successfully.`;
    const html =  signupTemplate

    const isEmailSent = await sendEmail(email, subject, text, html);
    if (!isEmailSent) {
      return res.status(500).send({ success: false, message: "User created but failed to send the welcome email." });
    }

    
    res.status(201).send({
      success: true,
      data: userCreate,
      message: "User created successfully",
    });

  } catch (error) {
    console.error("Error during signUp:", error.message);
    return res.status(500).send({
      success: false,
      message: "Error while creating user",
      error: error.message,
    });
  }
}
