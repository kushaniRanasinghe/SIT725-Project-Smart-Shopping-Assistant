// const mongoose = require('mongoose');

// // Define the user schema
// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   firstname: {
//     type: String,
//     required: true,
//   },
//   lastname: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   }
// });



// Export the User model
//module.exports = mongoose.model('user', userSchema);

//this model is used to store the details of the model

const mongoose = require('mongoose')


module.exports = mongoose.model('User', {
  email: String,
  firstname: String,
  lastname:String,
  password:String,
  user_type:String
})