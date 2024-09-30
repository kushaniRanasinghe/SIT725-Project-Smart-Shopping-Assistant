require('dotenv').config()

const express = require('express')
const paypal = require('./services/paypal')

const path = require('path')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')



//local imports
const connectDb = require('./db')
const productoutes = require('./controllers/product.controller')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname)));
app.use(express.static("uploads"))
//routing
app.use('/products', productoutes)

//configure view engine
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', engine({
  extname: "hbs",//index.hbs
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'mainLayout.hbs'
}))
app.set('view engine', '.hbs')


// Serve the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/layouts', 'signup.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/layouts', 'login.html'));
});
// Define a route to serve the index.html
app.get('/Cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/layouts/Cart.html'));
});
app.get('/Payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/layouts', 'Payment.html'));
});


app.post('/pay', async(req, res) => {
  try {
      const url = await paypal.createOrder()

      res.redirect(url)
  } catch (error) {
      res.send('Error: ' + error)
  }
})
app.get('/complete-order', async (req, res) => {
  try {
      await paypal.capturePayment(req.query.token)

      res.send('You goods are purchased successfully')
  } catch (error) {
      res.send('Error: ' + error)
  }
})
app.get('/cancel-order', (req, res) => {
  res.redirect('/')
})

// app.use('/new', productoutes)

//configure view engine
// app.set('views', path.join(__dirname, 'views'))
// app.engine('.hbs', engine({
//   extname: "hbs",//index.hbs
//   layoutsDir: path.join(__dirname, 'views/layouts'),
//   defaultLayout: 'shop.hbs'
// }))
// app.set('view engine', '.hbs')

// app.get('/shop', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views/layouts/shop.hbs'));
// });



connectDb()
  .then(data => {
    console.log('db connection succeeded.');
    app.listen(3000, () => {
      console.log('server started at 3000.');
    }).on('error', err =>
      console.log('server ignition failed:\n', err))
  })
  .catch(err => console.log('error in connecting db\n:', err))



  