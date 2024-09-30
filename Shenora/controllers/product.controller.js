const express = require('express')
const router = express.Router()

const Product = require('../models/product.model')
const multer = require('multer')

var storage = multer.diskStorage({
  destination: function(req, title,cb){
    cb(null,'./uploads')
  },
  filename:function(req,title,cb){
    cb(null, Date.now()+title.originalname)
  }
})

var upload = multer({
  storage:storage,
}).single("image");

router.get('/', (req, res) => {
  Product.find().lean()
    .then(data => {
      res.render("products/index", { products: data })
    })
    .catch(err =>
      console.log('error during fetching operation:\n', err))
})


router.get('/addOrEdit', (req, res) => {
  res.render('products/addOrEdit')
})

router.get('/shop', (req, res) => {
  Product.find().lean()
    .then(data => {
      res.render("products/shop", { products: data })
    })
    .catch(err =>
      console.log('error during fetching operation:\n', err))
})


router.get('/addOrEdit/:id', (req, res) => {
  Product.findById(req.params.id).lean()
    .then(data => res.render('products/addOrEdit', { product: data }))
    .catch(err =>
      console.log('error while retrieving the record:\n', err))

})

router.post('/addOrEdit',upload, (req, res) => {
  const product = {
    title: req.body.title,
    catogry: req.body.catogry,
    color:req.body.color,
    material:req.body.material,
    qty: req.body.qty,
    price: req.body.price,
    image:req.file.filename
  }
  const { _id } = req.body
  if (_id == '')
    new Product({ ...product }).save()
      .then(data => res.redirect('/products'))
      .catch(err => console.log('error during insertion:\n', err))
  else
    Product.findByIdAndUpdate(_id, product)
      .then(data => res.redirect('/products'))
      .catch(err => console.log('error during update operation:\n', err))
})

router.post('/delete/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(data => res.redirect('/products'))
    .catch(err => console.log('error during deletion:\n', err))
})

module.exports = router