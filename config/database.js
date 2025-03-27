const mongoose = require('mongoose')
require('dotenv').config()

const database  = () => {
    mongoose.connect(process.env.URL)
    .then(() => {
       console.log("successfully connected with database ");
       
    })
    .catch((err) => {
      console.log(err);
    })
   } 

   module.exports = database