const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = Schema({
  orderNo: {
    type: String
  },
  subTotal: {
    type: String
  },
  discount: {
    type: String
  },
  deliveryFee: {
    type: String
  },
  total: {
    type: String
  },
  gateway: {
    type: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
  },
  aprtmentNumber: {
    type: String
  },
  street: {
    type: String
  },
  suburb: {
    type: String
  },
  postalCode: {
    type: String
  },
  cardNumber: {
    type: String
  },
  cardHolderName: {
    type: String
  },
  expire: {
    type: String
  },
  cvv: {
    type: String
  },
})

module.exports = mongoose.model("Payment", paymentSchema);