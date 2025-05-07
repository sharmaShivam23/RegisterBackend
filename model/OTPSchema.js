// // const mongoose = require('mongoose')
// // const sendEmail = require('../Tools/sendEmail')

// // const otpSchema = new mongoose.Schema({
 
// //  email : {
// //    type : String,
// //    required : true,
// //  },
// //  otp : {
// //   type : String,
// //   required : true
// //  },
// //  createdAt : {
// //   type : Date,
// //   default : Date.now,
// //   expires : 5*60
// //  }

// // })


// // const sendVerificationMail = async(email,otp) => {
// //   try{
// //    const mailResponse = await sendEmail(email , "verify email from schloarX" , otp)
// //    console.log(mailResponse);
   
// //   }catch(err){
// //     console.log(`error occured to send mail`);
// //     console.log(err.message);
    
// //   }
// // }


// // otpSchema.pre("save" , async function(next){
// //   await sendVerificationMail(this.email , this.otp)
// //   next()
// // })


// // module.exports = mongoose.model("OTP" , otpSchema)

// const mongoose = require('mongoose');
// const sendEmail = require('../Tools/sendEmail');

// const otpSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   otp: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: 5 * 60
//   }
// });

// const sendVerificationMail = async (email, otp) => {
//   try {
//     const mailResponse = await sendEmail(
//       email,
//       "Verify your email - cloud Computing Cell",
//       `Your OTP is: ${otp}`
//     );
//     console.log(mailResponse);
//   } catch (err) {
//     console.log(`Error occurred while sending mail: ${err.message}`);
//   }
// };

// otpSchema.pre("save", async function (next) {
//   await sendVerificationMail(this.email, this.otp);
//   next();
// });

// module.exports = mongoose.model("OTP", otpSchema);

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../Tools/sendEmail"); 

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, 
  },
});


otpSchema.pre("save", async function (next) {
  try {
    const templatePath = path.join(__dirname, "../templates/otp.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  
    htmlTemplate = htmlTemplate
      .replace("{{otp}}", this.otp);

    await sendEmail(
      this.email,
      "Verify your email - Cloud Computing Cell",
      null, 
      htmlTemplate 
    );
    next();
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    next(error);
  }
});

module.exports = mongoose.model("OTP", otpSchema);
