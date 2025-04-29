


const User = require('../model/userSchema');
const sendEmail = require('../Tools/sendEmail');
const axios = require('axios');
const fs = require('fs');
const path = require('path');


exports.signUp = async (req, res) => {
  try {
    const { name, email, phoneNumber, studentNumber, branch, section, gender, residence } = req.body;
    // const { name, email, phoneNumber, studentNumber, branch, section, gender, residence, recaptchaValue } = req.body;
    const file = req.files?.file;

  
    if (!name || !email || !phoneNumber || !studentNumber || !branch || !section || !gender || !residence) {
      return res.status(400).send({ success: false, message: "All details are required" });
    }

    
    
    if (name.length < 3) {
      return res.status(400).send({ success: false, message: "Name must be at least 3 characters long" });
    }

  
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).send({ success: false, message: "Invalid  phone number" });
    }
    


    if (!/^24\d{5}$/.test(studentNumber)) {
      return res.status(400).send({ success: false, message: "Invalid student number" });
    }
    

  
    // // const splitName = name.split("")[0]

    // const expectedEmail = `${name}${studentNumber}@akgec.ac.in`;
    // if (email !== expectedEmail) {
    //   return res.status(400).send({ success: false, message: "Invalid Email" });
    // }
    
      
    // if (!recaptchaValue) {
    //   return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
    // }

    // const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    // const secretKey = process.env.SECRET_KEY;
    // const recaptchaResponse = await axios.post(verifyUrl, null, {
    //   params: {
    //     secret: secretKey,
    //     response: recaptchaValue,
    //   },
    // });

    // if (!recaptchaResponse.data.success) {
    //   return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
    // }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ success: false, message: "Email already exists" });
    }

   
    const userCreate = await User.create({
      name,
      email,
      phoneNumber,
      studentNumber,
      branch,
      section,
      gender,
      residence,
    });

  
    const templatePath = path.join(__dirname, '../Templates/signup.html');
    if (!fs.existsSync(templatePath)) {
      return res.status(500).send({
        success: false,
        message: "Signup template not found.",
      });
    }

    const signupTemplate = fs.readFileSync(templatePath, 'utf8');
    const subject = "Welcome to cloud computing cell!";
    const text = `Hi ${name}, Congratulations! Registration successful.`;
    const html  = signupTemplate.replace(/{{\s*name\s*}}/g, name)


    const isEmailSent = await sendEmail(email, subject, text, html);
    if (!isEmailSent) {
      return res.status(500).send({ success: false, message: "Failed to send the email." });
    }

    res.status(201).send({
      success: true,
      data: userCreate,
      message: "Registration successful",
    });

  } catch (error) {
    console.error("Error during signUp:", error.message);
    return res.status(500).send({
      success: false,
      message: "Error during signup! Try again",
      error: error.message,
    });
  }
};
