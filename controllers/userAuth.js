// const user = require('../model/userSchema');
// const sendEmail = require('../Tools/sendEmail');
// const axios = require('axios')
// const fs = require('fs')
// const path  = require('path')

// exports.signUp = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, phoneNumber, recaptchaValue } = req.body;
    
//     if (!recaptchaValue) {
//       return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
//     }

    
//     const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
//     const secretKey = process.env.SECRET_KEY;

//     const recaptchaResponse = await axios.post(verifyUrl, null, {
//       params: {
//         secret: secretKey,
//         response: recaptchaValue,
//       },
//     });

//     if (!recaptchaResponse.data.success) {
//       return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
//     }
    
//     if (!firstName || !lastName || !email || !password || !phoneNumber || !confirmPassword || !selectedRole) {
//       return res.status(400).send({ success: false, message: "All details are required" });
//     }
//     if (firstName.length < 3 || lastName.length < 3) {
//       return res.status(400).send({ success: false, message: "Name must be at least 3 characters long" });
//     }
//     if (password.length < 6) {
//       return res.status(400).send({ success: false, message: "Password should be at least 6 characters long" });
//     }
//     if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
//       return res.status(400).send({ success: false, message: "Phone number should be exactly 10 digits" });
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).send({ success: false, message: "Passwords do not match" });
//     }
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).send({ success: false, message: "Invalid email format" });
//     }

//     const existEmail = await user.findOne({ email });
//     if (existEmail) {
//       return res.status(400).send({ success: false, message: "Email already exists" });
//     }

    

//     const userCreate = await user.create({
//       name,
//       email,
//       password: hashpassword,
//       phoneNumber,
//       dob,
//       selectedRole
//     });

    
//     const templatePath = path.join(__dirname, '../Templates/signup.html');
//     if (!fs.existsSync(templatePath)) {
//       return res.status(500).send({
//         success: false,
//         message: "signup template not found.",
//       });
//     }
//     const signupTemplate = fs.readFileSync(templatePath, 'utf8');

    
//     const subject = "Welcome to Our Platform!";
//     const text = `Hi ${firstName}, Congratulations! Your account has been created successfully.`;
//     const html =  signupTemplate

//     const isEmailSent = await sendEmail(email, subject, text, html);
//     if (!isEmailSent) {
//       return res.status(500).send({ success: false, message: "User created but failed to send the welcome email." });
//     }

    
//     res.status(201).send({
//       success: true,
//       data: userCreate,
//       message: "User created successfully",
//     });

//   } catch (error) {
//     console.error("Error during signUp:", error.message);
//     return res.status(500).send({
//       success: false,
//       message: "Error while creating user",
//       error: error.message,
//     });
//   }
// }


const User = require('../model/userSchema');
const sendEmail = require('../Tools/sendEmail');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

function isFileTypeSupported(reqFileType, supportTypes) {
  return supportTypes.includes(reqFileType);
}

async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.signUp = async (req, res) => {
  try {
    const { name, email, phoneNumber, studentNumber, branch, section, gender, residence, recaptchaValue } = req.body;
    const { file } = req.files;

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

    if (!name || !email || !phoneNumber || !studentNumber || !branch || !section || !gender || !residence || !file) {
      return res.status(400).send({ success: false, message: "All details and profile picture are required" });
    }

    if (name.length < 3) {
      return res.status(400).send({ success: false, message: "Name must be at least 3 characters long" });
    }

    if (phoneNumber.toString().length !== 10 || !/^\d+$/.test(phoneNumber)) {
      return res.status(400).send({ success: false, message: "Phone number should be exactly 10 digits" });
    }

    if (studentNumber.toString().length < 5) {
      return res.status(400).send({ success: false, message: "Invalid student number" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ success: false, message: "Invalid email format" });
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ success: false, message: "Email already exists" });
    }

    let supportTypes = ["png", "jpg", "jpeg"];
    let reqFileType = file.name.split(".").pop().toLowerCase();

    if (!isFileTypeSupported(reqFileType, supportTypes)) {
      return res.status(400).send({
        success: false,
        message: "File type not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "lmsfolder");

    const userCreate = await User.create({
      name,
      email,
      phoneNumber,
      studentNumber,
      branch,
      section,
      gender,
      residence,
      imageURL: response.secure_url
    });

    const templatePath = path.join(__dirname, '../Templates/signup.html');
    if (!fs.existsSync(templatePath)) {
      return res.status(500).send({
        success: false,
        message: "Signup template not found.",
      });
    }

    const signupTemplate = fs.readFileSync(templatePath, 'utf8');

    const subject = "Welcome to Our Platform!";
    const text = `Hi ${name}, Congratulations! Your account has been created successfully.`;
    const html = signupTemplate;

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
};

