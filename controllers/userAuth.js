
// const User = require('../model/userSchema');
// const sendEmail = require('../Tools/sendEmail');
// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');
// const cloudinary = require('cloudinary').v2;

// function isFileTypeSupported(reqFileType, supportTypes) {
//   return supportTypes.includes(reqFileType);
// }

// async function uploadFileToCloudinary(file, folder) {
//   const options = { folder };
//   return await cloudinary.uploader.upload(file.tempFilePath, options);
// }

// exports.signUp = async (req, res) => {
//   try {
//     const { name, email, phoneNumber, studentNumber, branch, section, gender, residence, recaptchaValue } = req.body;
//     const { file } = req.files;

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


//     if (!name || !email || !phoneNumber || !studentNumber || !branch || !section || !gender || !residence) {
//       return res.status(400).send({ success: false, message: "All details  are required" });
//     }

//     else if (name.length < 2) {
//       return res.status(400).send({ success: false, message: "Name must be at least 3 characters long" });
//     }


//     else if (phoneNumber.toString().length !== 10 || !/^\d+$/.test(phoneNumber)) {
//       return res.status(400).send({ success: false, message: "Phone number should be exactly 10 digits" });
//     }

//     else if (!studentNumber.startsWith('24')) {
//       return res.status(400).send({ success: false, message: "Invalid student number" });
//     }

//     else if (!email.endsWith("@akgec.ac.in")) {
//       return res.status(400).send({ success: false, message: "Invalid email format" });
//     }

//     else  if(!file){
//       return res.status(400).send({ success: false, message: "payment screenshot is required" });
//     }

//     else if (!recaptchaValue) {
//       return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
//     }



//     const existEmail = await User.findOne({ email });
//     if (existEmail) {
//       return res.status(400).send({ success: false, message: "Email already exists" });
//     }



//     let supportTypes = ["png", "jpg", "jpeg"];
//     let reqFileType = file.name.split(".").pop().toLowerCase();

//     if (!isFileTypeSupported(reqFileType, supportTypes)) {
//       return res.status(400).send({
//         success: false,
//         message: "File type not supported",
//       });
//     }

//     const response = await uploadFileToCloudinary(file, "lmsfolder");

//     const userCreate = await User.create({
//       name,
//       email,
//       phoneNumber,
//       studentNumber,
//       branch,
//       section,
//       gender,
//       residence,
//       imageURL: response.secure_url
//     });

//     const templatePath = path.join(__dirname, '../Templates/signup.html');
//     if (!fs.existsSync(templatePath)) {
//       return res.status(500).send({
//         success: false,
//         message: "Signup template not found.",
//       });
//     }

//     const signupTemplate = fs.readFileSync(templatePath, 'utf8');

//     const subject = "Welcome to cloud computing cell!";
//     const text = `Hi ${name}, Congratulations! Registration successfull.`;
//     const html = signupTemplate;

//     const isEmailSent = await sendEmail(email, subject, text, html);
//     if (!isEmailSent) {
//       return res.status(500).send({ success: false, message: "failed to send the  email." });
//     }

//     res.status(201).send({
//       success: true,
//       data: userCreate,
//       message: "Registration successfully",
//     });

//   } catch (error) {
//     console.error("Error during signUp:", error.message);
//     return res.status(500).send({
//       success: false,
//       message: "Error to signup! try again",
//       error: error.message,
//     });
//   }
// };



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
    const file = req.files?.file;

  


    
    if (!name || !email || !phoneNumber || !studentNumber || !branch || !section || !gender || !residence) {
      return res.status(400).send({ success: false, message: "All details are required" });
    }

    
    if (!file) {
      return res.status(400).send({ success: false, message: "Payment screenshot is required" });
    }

    
    if (name.length < 3) {
      return res.status(400).send({ success: false, message: "Name must be at least 3 characters long" });
    }

  
    if (phoneNumber.toString().length !== 10 || !/^\d+$/.test(phoneNumber)) {
      return res.status(400).send({ success: false, message: "Phone number should be exactly 10 digits" });
    }


    if (!studentNumber.startsWith('24')) {
      return res.status(400).send({ success: false, message: "Invalid student number" });
    }


    if (!email.endsWith("@akgec.ac.in")) {
      return res.status(400).send({ success: false, message: "Invalid email format" });
    }

      
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
    const subject = "Welcome to cloud computing cell!";
    const text = `Hi ${name}, Congratulations! Registration successful.`;
    const html = signupTemplatereplace("{{ name }}", name);

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
