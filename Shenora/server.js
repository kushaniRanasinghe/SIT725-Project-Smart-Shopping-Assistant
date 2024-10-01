// Load environment variables from the .env file
require('dotenv').config()

// Import necessary modules
const express = require('express'); // Web framework for Node.js
const paypal = require('./services/paypal'); // PayPal integration service

const path = require('path'); // Node.js module for handling file paths
const mongoose = require('mongoose');
const { engine } = require('express-handlebars'); // Handlebars view engine for rendering HTML
const bodyParser = require('body-parser'); // Middleware for parsing incoming request bodies
const PORT = 3000;

const Payment = require('./models/payment.model')

//const userRoutes = require('./routes/user');

//const userRoutes = require('./routes/user');

// Import custom routes and controllers
const cartRoutes = require('./routes/cartRoutes'); // Routes for managing the cart
const cartController = require('./controllers/cart.controller'); // Controller handling cart operations

//local imports
const connectDb = require('./db')
const productoutes = require('./controllers/product.controller')

// Import the user controller
const userController = require('./controllers/user.controller');

const app = express(); // Initialize the express app
// Middleware for parsing URL-encoded and JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up static file serving from the root directory and "uploads" folder
app.use(express.static(path.join(__dirname)));
app.use(express.static("uploads"));

// Routing for product-related routes
app.use('/products', productoutes)
app.use('/user', userController)

// Configure the view engine (Handlebars) for rendering HTML templates
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.engine('.hbs', engine({
  extname: "hbs", // Set the file extension for Handlebars templates
  layoutsDir: path.join(__dirname, 'views/layouts'), // Set the layouts directory
  defaultLayout: 'mainLayout.hbs', // Set the default layout file
  helpers: {
    // Helper function for multiplying price by quantity (for displaying totals)
    multiply: (price, quantity) => price * quantity
  }
}));
app.set('view engine', '.hbs'); // Set the view engine to Handlebars with the .hbs extension

// New line added for cart-related routes
app.use('/cart', cartRoutes); // Use cart routes for all '/cart' endpoints

// Route for serving the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/layouts', 'signup.html'));
});

// Route for serving the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/layouts', 'login.html'));
});

// Route for serving the Cart page (HTML file)
app.get('/Cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'layouts', 'Cart.html')); // Serve the Cart.html file
});

// Route for serving the Payment page (HTML file)
// app.get('/Payment', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views/layouts', 'Payment.html')); // Serve the Payment.html file
// });

app.get('/Payment', (req, res) => {
  const { orderNo } = req.query

  // const order = await Order.findOne({orderNo: orderNo}).lean()
  const order = {
    id: 1,
    orderNo: orderNo,
    subTotal: 100,
    discount: 10,
    deliveryFee: 50,
    total: 140.00,
    items: [
      {
        id: "1",
        title: "Cute Graphic T-Shirt",
        rate: 20,
        qty: 5
      }
    ]
  }
  res.render('layouts/Payment', { order })
  // res.sendFile(path.join(__dirname, 'views/layouts', 'Payment.html'));
});



// Route for initiating a payment via PayPal
app.post('/pay', async (req, res) => {
  try {
    const url = await paypal.createOrder(); // Create PayPal order and get the payment URL

    res.redirect(url); // Redirect the user to PayPal for payment
  } catch (error) {
    res.send('Error: ' + error); // Handle errors
  }
});

// Route for completing the PayPal payment
app.get('/complete-order', async (req, res) => {
  try {
    await paypal.capturePayment(req.query.token)

    const updatedPayment = await Payment.updateOne(
      { orderNo: req.query.orderNo },
      {
        $set: {
          isPaid: true
        }
      },
      { new: true }
    )
    res.render('layouts/OrderComplete')
  } catch (error) {
    res.send('Error: ' + error)
  }
})

// Route for handling canceled PayPal orders
app.get('/cancel-order', (req, res) => {
  res.redirect('/'); // Redirect to the homepage when an order is canceled
});

app.post('/pay/card', async (req, res) => {
  try {
    const payment = await Payment({
      ...req.body,
      gateway: "card",
      isPaid: true
    }).save()

    //TODO: get order from DB
    res.json({
      success: true,
      redirectURL: '/order/completed',
    })
  } catch (error) {
    res.send('Error: ' + error)
  }
})

app.get('/order/completed', async (req, res) => {
  try {
    res.render('layouts/OrderComplete')
  } catch (error) {
    res.send('Error: ' + error)
  }
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

// // Route to handle login form submission
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Check if the username and password are correct
//   if (username === 'admin' && password === 'admin1') {
//       // Redirect to home page if login is successful
//       res.redirect('/shop.hbs'); // Assuming '/home' is the route for the home page of your project
//   } else {
//       // If the login is invalid, send an error message or redirect back to login
//       res.send('Invalid login credentials. Please try again.');
//   }
// });


// Connect to the database and start the server
connectDb()
  .then(data => {
    console.log('db connection succeeded.');// Log success message when the database connection is successful
    app.listen(3000, () => {
      console.log('server started at 3000.');// Start the server and log the port
    }).on('error', err =>
      console.log('server ignition failed:\n', err))// Handle server startup errors
  })
  .catch(err => console.log('error in connecting db\n:', err))// Handle database connection errors


  // MongoDB connection
mongoose.connect('mongodb+srv://s220194805:nC0IFkpgBCS1fp0q@cluster0.k3wz2.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));
