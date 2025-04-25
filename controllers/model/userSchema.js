const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name : {
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
  studentNumber : {
    type : Number,
    required : true
  },
  branch : {
    type : String,
    required : true,
  },
  section : {
    type : String,
    required : true,
  },
  gender : {
    type : String,
    required : true,
  },
  residence : {
    type : String,
    required : true,
  },
  imageURL : {
    type : String,
    required : true
  }
})

module.exports = mongoose.model("User" , userSchema)

