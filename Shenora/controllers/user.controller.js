// const express = require('express')
// const router = express.Router()


// const multer = require('multer')
// // controllers/userController.js
// const User = require('../models/user.model');

// // Handle user signup
// exports.registerUser = (req, res) => {
//     const { email, firstName, lastName, password } = req.body;

//     const newUser = new User({
//         email,
//         firstName,
//         lastName,
//         password
//     });

//     newUser.save((err) => {
//         if (err) {
//             console.log('Error saving user:', err);
//             res.send('Error registering user.');
//         } else {
//             res.send('User successfully registered!');
//         }
//     });
// };




// const User = require('../models/user.model'); // Import the user model

// // Handle user registration
// exports.registerUser = (req, res) => {
//   const { email, firstName, lastName, password } = req.body;

//   // Create a new user object
//   const newUser = new User({
//     email,
//     firstName,
//     lastName,
//     password
//   });

//   // Save the user to the database
//   newUser.save((err) => {
//     if (err) {
//       console.log('Error saving user:', err);
//       res.status(500).send('Error registering user.');
//     } else {
//       res.status(200).send('User successfully registered!');
//     }
//   });
// };

// // Handle displaying the registration form (if you want to have a separate view for the form)
// exports.showRegisterForm = (req, res) => {
//   res.render('signup'); // Assuming you have a signup.html or signup.ejs in your views
// };

const express = require('express')
const router = express.Router()

const user = require('../models/user.model')
const multer = require('multer')

var storage = multer.diskStorage({
  destination: function(req, title,cb){
    cb(null,'./uploads')
  },
  filename:function(req,title,cb){
    cb(null, Date.now()+title.originalname)
  }
})

// var upload = multer({
//   storage:storage,
// }).single("image");

// router.get('/', (req, res) => {
//   Product.find().lean()
//     .then(data => {
//       res.render("products/index", { products: data })
//     })
//     .catch(err =>
//       console.log('error during fetching operation:\n', err))
// })


router.get('/signup', (req, res) => {
  res.render('views/layout/signup')
})

// router.get('/signup', (req, res) => {
//   Product.find().lean()
//     .then(data => {
//       res.render("products/shop", { products: data })
//     })
//     .catch(err =>
//       console.log('error during fetching operation:\n', err))
// })
    

router.get('/views/layouts/signup/:id', (req, res) => {
  users.findById(req.params.id).lean()
    .then(data => res.render('views/layouts/signup', { user: data }))
    .catch(err =>
      console.log('error while retrieving the record:\n', err))

})

router.post('/views/layouts/signup',(req, res) => {
  const users = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname:req.body.lastname,
    password:req.body.password,
    
  }
  const { _id } = req.body
  if (_id == '')
    new users({ ...user }).save()
      .then(data => res.redirect('/signup'))
      .catch(err => console.log('error during insertion:\n', err))
  else
    users.findByIdAndUpdate(_id, user)
      .then(data => res.redirect('/views/layouts/signup'))
      .catch(err => console.log('error during update operation:\n', err))
})

router.post('/delete/:id', (req, res) => {
  users.findByIdAndDelete(req.params.id)
    .then(data => res.redirect('/views/layouts/signup'))
    .catch(err => console.log('error during deletion:\n', err))
})

module.exports = router