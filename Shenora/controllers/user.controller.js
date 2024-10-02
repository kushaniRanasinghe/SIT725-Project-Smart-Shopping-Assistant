const express = require('express') // Import the Express module for building the web server
const router = express.Router() // Create a new Express router instance to define routes
const path = require('path'); // Import the 'path' module to handle and transform file paths
const user = require('../models/user.model') // Import the User model for database interaction (Mongoose)
const multer = require('multer') // Import 'multer' for handling file uploads
const userModel = require('../models/user.model'); // Redundant import of the User model, already imported as 'user'
const { isEmpty } = require('lodash'); // Import lodash utility library for checking if objects are empty
 
// Configure multer for handling file uploads, specifying the storage destination and filename
var storage = multer.diskStorage({
  destination: function(req, title, cb) {
    cb(null, './uploads') // Set the destination folder for storing uploaded files
  },
  filename: function(req, title, cb) {
    cb(null, Date.now() + title.originalname) // Create a unique filename by appending a timestamp to the original file name
  }
})
 
// Get a user by ID and render the signup page with user data (used for editing user information)
router.get('/views/layouts/signup/:id', (req, res) => {
  users.findById(req.params.id).lean() // Find the user by ID
    .then(data => res.render('views/layouts/signup', { user: data })) // Render the signup page and pass the user data to the view
    .catch(err =>
      console.log('error while retrieving the record:\n', err)) // Log any errors that occur while retrieving the user
})
 
// Handle login by checking if the provided email and password match a user in the database
router.post('/login', (req, res) => {
  userModel.findOne({
    email: req.body.username, // Check if the user exists by matching the provided email (username)
    password: req.body.password // Check if the provided password matches the stored password
  }).lean().then(d => {
    if (!d) {
        res.redirect('/login?valid=false') // If no user is found, redirect back to the login page with a 'valid=false' query parameter
    } else if (d.user_type == 'admin') {
        // If the user is an admin, set a cookie and redirect them to the admin products page
        res.cookie('id', d._id, { expires: new Date(Date.now() + 900000), httpOnly: true }); // Set a cookie storing the user ID
        res.redirect(`/products?valid=true&id=${d._id}`) // Redirect to the admin products page
    } else {
        // If the user is not an admin, set a cookie and redirect them to the customer products page
        res.cookie('id', d._id, { expires: new Date(Date.now() + 900000), httpOnly: true }); // Set a cookie storing the user ID
        res.redirect(`/products/shop?valid=true&id=${d._id}`) // Redirect to the customer products page
    }
  })
  .catch(e => {
    res.redirect('/login/?valid=false') // If there is an error during login, redirect back to the login page with 'valid=false'
  })
})
 
// Fetch the logged-in user's info using the stored cookie and render the user info page
router.get('/userinfo', (req, res) => {
  user_id = req.cookies.id // Retrieve the user ID from the cookie
  if (!user_id) {
    res.redirect('/login?valid=false') // If no user ID is found in the cookies, redirect to the login page
  }
  userModel.findById(user_id).lean() // Find the user by the ID stored in the cookie
  .then(d => {
    res.render('products/updateuser', { info: d }) // Render the user info update page, passing in the user's data
  })
  .catch(e => {
    res.redirect('/login?valid=false') // If there is an error retrieving the user, redirect to the login page
  })
})
 
// Update the logged-in user's info using data from the request body
router.post('/updateinfo', (req, res) => {
  user_id = req.cookies.id // Retrieve the user ID from the cookie
  if (!user_id) {
    res.redirect('/login?valid=false') // Redirect to the login page if no user ID is found in the cookies
  }
  userModel.findByIdAndUpdate(user_id, req.body) // Update the user's data in the database using the data from the form
  .then(d => {
    res.redirect('/user/userinfo') // After updating, redirect the user to their info page
  })
  .catch(e => {
    console.error(e) // Log any errors that occur during the update process
  })
})
 
// Delete the logged-in user's account if they are not an admin
router.post('/deleteinfo', (req, res) => {
  user_id = req.cookies.id // Retrieve the user ID from the cookie
  if (!user_id) {
    res.redirect('/login') // Redirect to the login page if no user ID is found in the cookies
  }
  userModel.findById(user_id).lean() // Find the user by their ID
  .then(d => {
    if (d.user_type != 'admin') { // Only allow deletion if the user is not an admin
      userModel.findByIdAndDelete(user_id) // Delete the user's record from the database
      .then(data => {
        res.redirect('/login') // After deletion, redirect to the login page
      })
      .catch(err => {
        res.redirect('/login') // Redirect to login in case of an error during deletion
      })
    }
    res.redirect('/login') // If the user is an admin, redirect them to the login page without deleting
  })
  .catch(e => {
    res.redirect('/login') // Handle any errors and redirect to the login page
  })
})
 
// Handle user signup (register a new user)
router.post('/signup', (req, res) => {
  const user = {
    email: req.body.email, // Capture email from the form
    firstname: req.body.firstname, // Capture first name from the form
    lastname: req.body.lastname, // Capture last name from the form
    password: req.body.password, // Capture password from the form
    user_type: 'user' // Set the user type to 'user' by default (non-admin)
  }
  const { _id } = req.body
 
  userModel.findOne({email: user.email}).lean() // Check if a user with the same email already exists
  .then(d => {
    if (isEmpty(d)) { // If no user with the same email is found
      userModel.create(user) // Create a new user with the provided information
      .then(data => res.redirect('/login')) // After successful signup, redirect to the login page
      .catch(err => console.log('error during insertion:\n', err)) // Log any errors that occur during user creation
    }
  })
})
 
// Delete a user by their ID
router.post('/delete/:id', (req, res) => {
  users.findByIdAndDelete(req.params.id) // Find and delete the user by their ID
    .then(data => res.redirect('/views/layouts/signup')) // After deletion, redirect to the signup page
    .catch(err => console.log('error during deletion:\n', err)) // Log any errors that occur during deletion
})
 
module.exports = router // Export the router to be used in the main app