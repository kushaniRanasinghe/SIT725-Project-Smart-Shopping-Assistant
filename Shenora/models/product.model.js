const mongoose = require('mongoose')


module.exports = mongoose.model('Product', {
  title: String,
  catogry: String,
  color:String,
  material:String,
  qty: Number,
  price: Number,
  image:String

})