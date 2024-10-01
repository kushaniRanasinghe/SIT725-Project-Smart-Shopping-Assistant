const express = require('express')
const router = express.Router()
const path = require('path');
const user = require('../models/user.model')
const multer = require('multer')
const userModel = require('../models/user.model');
const { isEmpty } = require('lodash');

var storage = multer.diskStorage({
  destination: function(req, title,cb){
    cb(null,'./uploads')
  },
  filename:function(req,title,cb){
    cb(null, Date.now()+title.originalname)
  }
})

router.get('/views/layouts/signup/:id', (req, res) => {
  users.findById(req.params.id).lean()
    .then(data => res.render('views/layouts/signup', { user: data }))
    .catch(err =>
      console.log('error while retrieving the record:\n', err))

})

router.post('/login',(req, res) => {
  userModel.findOne({
    email: req.body.username,
    password: req.body.password
  }).lean().then(d=>{
    if(!d){
        res.redirect('/login?valid=false')
    }else if(d.user_type=='admin'){
        res.cookie('id', d._id, { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.redirect(`/products?valid=true&id=${d._id}`)
    }else{
        res.cookie('id', d._id, { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.redirect(`/products/shop?valid=true&id=${d._id}`)
    }
  })
  .catch(e=>{
    res.redirect('/login/?valid=false')
  })
})

router.get('/userinfo',(req, res) => {
  user_id = req.cookies.id
  if(!user_id){
    res.redirect('/login?valid=false')
  }
  userModel.findById(user_id).lean()
  .then(d=>{
    res.render('products/updateuser', { info: d })
  })
  .catch(e=>{
    res.redirect('/login?valid=false')
  })
  
})

router.post('/updateinfo',(req, res) => {
  user_id = req.cookies.id
  if(!user_id){
    res.redirect('/login?valid=false')
  }
  userModel.findByIdAndUpdate(user_id, req.body)
  .then(d=>{
    res.redirect('/user/userinfo')
  })
  .catch(e=>{
    console.error(e)
  })
})

router.post('/deleteinfo',(req, res) => {
  user_id = req.cookies.id
  if(!user_id){
    res.redirect('/login')
  }
  userModel.findById(user_id).lean()
  .then(d=>{
    if(d.user_type != 'admin'){
      userModel.findByIdAndDelete(user_id)
      .then(data =>{
        res.redirect('/login')
      })
      .catch(err=>{
        res.redirect('/login')
      })
    }
    res.redirect('/login')
  })
  .catch(e=>{
    res.redirect('/login')
  })
})

router.post('/signup',(req, res) => {
  const user = {
    email: req.body.email,
    firstname: req.body.firstname,
    lastname:req.body.lastname,
    password:req.body.password,
    user_type:'user'
  }
  const { _id } = req.body

  userModel.findOne({email: user.email}).lean()
  .then(d=>{
    if(isEmpty(d)){
      userModel.create(user)
      .then(data => res.redirect('/login'))
      .catch(err => console.log('error during insertion:\n', err))
    }
  })
})

router.post('/delete/:id', (req, res) => {
  users.findByIdAndDelete(req.params.id)
    .then(data => res.redirect('/views/layouts/signup'))
    .catch(err => console.log('error during deletion:\n', err))
})

module.exports = router