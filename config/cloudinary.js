const cloudinary = require('cloudinary').v2
require('dotenv').config()

exports.cloudinaryConnect = async(req,res) => {
  try{

    cloudinary.config({
      api_key : process.env.API_KEY,
      api_secret : process.env.API_SECRET,
      cloud_name : process.env.CLOUD_NAME
    })

  }catch(err){
    console.log(err);
    res.status(500).send({
      success : false,
      message : "Failed to connect with cloudinary"
    })
    
  }
}