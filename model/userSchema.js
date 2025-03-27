const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName : {
    type : String,
    required : true
  },
  lastName : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
  },
  phoneNumber : {
    type : Number,
    required : true
  },
  dob : {
    type : Date,
  },
  password : {
    type : String,
    required : true
  },
  selectedRole : {
    type : String,
  }
})

module.exports = mongoose.model("User" , userSchema)



// unique: true,
// match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]