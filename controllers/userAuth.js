const User = require('../model/userSchema');
const sendEmail = require('../Tools/sendEmail');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const OTP = require('../model/OTPSchema');
const otpGenerator = require('otp-generator');


// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 30,
//   message: {
//     success: false,
//     message: "Too many requests from this IP, please try again later.",
//   },
// });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 62,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after an hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
exports.limiter = limiter;




exports.sendOTP = async(req,res) => {
  try{
  const {email} = req.body

  if(!email){
    return res.status(400).json({
      success : false,
      message : "email is required"
    })
  }

  const existUser= await User.findOne({email})
  if(existUser){
   return res.status(401).json({
      success : false,
      message : "user already exits"
    })
  }

  let otp = otpGenerator.generate(5 , {
    upperCaseAlphabets : false,
    lowerCaseAlphabets : false,
    specialChars : false,
  })
 console.log(otp);

 let result = await OTP.findOne({otp : otp})
 //if the genearted otp is already present in db genearte other unique otp
 while(result){
  otp = otpGenerator.generate(5 , {
    upperCaseAlphabets : false,
    lowerCaseAlphabets : false,
    specialChars : false,
  })
  result = await OTP.findOne({otp : otp})
 }
 
 const otpPayload = {email,otp}
 const otpresult = await OTP.create(otpPayload)
 console.log(otpresult);
 

 res.status(200).json({
  success : true,
  message : "otp send successfully",
  otp
 })
  }catch(err){
   console.log(err);
   res.status(500).json({
    success : true,
    message : err.message
   })
   
  }
}



exports.signUp = async (req, res) => {
  try {
    // const { name, email, phoneNumber, studentNumber, branch, section, gender, residence , transactionID , otp} = req.body;
  
    const { name, email, phoneNumber, studentNumber, branch, section, gender, residence, recaptchaValue , transactionID , otp } = req.body;
    

  
    if (!name || !email || !phoneNumber || !studentNumber || !branch || !section || !gender || !residence) {
      return res.status(400).send({ success: false, message: "All details are required" });
    }

    
    
    if (name.length < 3) {
      return res.status(400).send({ success: false, message: "Name must be at least 3 characters long" });
    }

    if(!otp){
      return res.status(403).json({
         success : false,
         message : "OTP verification failed!"
       })
     }
   

    //find recent used otp
    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }); // get latest OTP
   console.log("re" , recentOTP);
   
    if(!recentOTP ){
      return res.status(403).json({
        success: false,
        message: "OTP is required!",
      });
    }

    if (String(recentOTP.otp).trim() !== String(otp).trim())       {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    
    

  
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).send({ success: false, message: "Invalid  phone number" });
    }

    if(!transactionID){
      return res.status(400).send({ success: false, message: "transaction ID is required" });
    }
  


    // // const splitName = name.split("")[0]

    // const expectedEmail = `${name}${studentNumber}@akgec.ac.in`;
    // if (email !== expectedEmail) {
    //   return res.status(400).send({ success: false, message: "Invalid Email" });
    // }

    // if(!transactionID){
    //   return res.status(400).send({ success: false, message: "transaction ID is required" });
    // }
    
      
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

    if(transactionID){
    const existTrans = await User.findOne({transactionID});
    if (existTrans) {
      return res.status(400).send({ success: false, message: "Transaction ID already exists" });
    }
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
      transactionID
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
    // if (!isEmailSent) {
    //   return res.status(500).send({ success: false, message: "Failed to send the email." });
    // }

    res.status(201).send({
      success: true,
      data: userCreate,
      message: "Registration successful for NIMBUS 2.0",
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
