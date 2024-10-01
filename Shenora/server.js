// Load environment variables from the .env file
require('dotenv').config()
const url = require('url');
const { v4: uuidv4 } = require('uuid');

// Import necessary modules
const express = require('express'); // Web framework for Node.js
//const paypal = require('./services/paypal'); // PayPal integration service
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox',
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_SECRET
});

const Cart = require('./models/cart.model');
const path = require('path'); // Node.js module for handling file paths
const mongoose = require('mongoose');
const { engine } = require('express-handlebars'); // Handlebars view engine for rendering HTML
const bodyParser = require('body-parser'); // Middleware for parsing incoming request bodies
const PORT = 3000;

const cookieParser = require('cookie-parser');
const Payment = require('./models/payment.model')

// Import custom routes and controllers
const cartRoutes = require('./routes/cartRoutes'); // Routes for managing the cart
const cartController = require('./controllers/cart.controller'); // Controller handling cart operations

//local imports
const connectDb = require('./db')
const productoutes = require('./controllers/product.controller')

// Import the user controller
const userController = require('./controllers/user.controller');
const paymentModel = require('./models/payment.model');

const app = express(); // Initialize the express app
// Middleware for parsing URL-encoded and JSON request bodies
app.use(cookieParser());
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

const temp_data = {}

app.get('/Payment', (req, res) => {
  const { base, discount, delivery, total } = req.query
  const user_id = req.cookies.id

  const Cart = require('./models/cart.model');

  Cart.findOne().then(cart => {
    const items = cart.products.filter(d => d.user_id == user_id).map(d => ({
      id: d.productId,
      title: "title",
      rate: 20,
      qty: d.quantity
    }))
    res.render('layouts/Payment', {
      order: {
        id: uuidv4(),
        orderNo: uuidv4(),
        subTotal: base,
        discount: discount,
        deliveryFee: delivery,
        total: total,
        items
      }
    })
  })
});



// Route for initiating a payment via PayPal
app.post('/pay', async (req, res) => {

  const user_id = req.cookies.id

  const cart = await Cart.findOne().populate('products.productId')
  const products = cart.products.filter(d => d.user_id == user_id);
  const items = []
  const re = {
      user_id,
      products: [],
      total: req.body.total,
      orderid: req.body.orderNo
  }
  products.forEach(d => {
    items.push({
      "name": d.productId.title,
      "sku": d.productId._id,
      "price": d.productId.price,
      "currency": "USD",
      "quantity": d.quantity
    })
    re.products.push((
      {
        productId: d.productId._id,
        qty: d.quantity
      }
    ))

  })

  payment_data = new Payment({
    orderNo: req.body.orderNo,
    subTotal: req.body.subtotal,
    discount: req.body.discount,
    deliveryFee: req.body.delivery,
    total: req.body.total,
    gateway: "paypal",
    isPaid: false,
    email: req.body.email,
    aprtmentNumber: req.body.apartmentNum,
    street: req.body.street,
    suburb: req.body.suburb,
    postalCode: req.body.postalCode,
    cardNumber: req.body.cardNumber,
    cardHolderName: req.body.holdername,
    expire: req.body.exp,
    cvv: req.body.cvv,
    items: re.products,
    userid: user_id
  })
  const {_id} = await payment_data.save()
  re['id'] =  _id

  try {

    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
        "item_list": {
          "items": items
        },
        "amount": {
          "currency": "USD",
          "total": req.body.subtotal
        },
        "description": "Order " + req.body.orderNo
      }]
    };

    paypal.payment.create(
      JSON.stringify(create_payment_json),
      function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {
              const parsedUrl =url.parse(payment.links[i].href, true);
              temp_data[parsedUrl.query.token] = re
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
  } catch (error) {
    res.send('Error: ' + error); // Handle errors
  }
});

app.get('/success', async (req, res) => {

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const token = req.query.token

  const user_id = req.cookies.id
  const payment_details = temp_data[token]

  if(!payment_details){
    return
  }
  const last_payment = await Payment.findById(payment_details.id)
  if(last_payment){
    last_payment['isPaid'] = true
    last_payment.save()
  }
  console.log(last_payment, payment_details)
  const cart = await Cart.findOne();
  cart.products = cart.products.filter(p => p.user_id!=user_id);
  await cart.save();

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": `${last_payment.subTotal}`
      }
    }]
  };

  paypal.payment.execute(paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        res.render('layouts/OrderComplete')
      }
    });
});

app.get('/cancel', (req, res) => res.redirect('/'));

// Route for completing the PayPal payment
// app.get('/complete-order', async (req, res) => {
//   try {
//     await paypal.capturePayment(req.query.token)

//     const updatedPayment = await Payment.updateOne(
//       { orderNo: req.query.orderNo },
//       {
//         $set: {
//           isPaid: true
//         }
//       },
//       { new: true }
//     )
//     res.render('layouts/OrderComplete')
//   } catch (error) {
//     res.send('Error: ' + error)
//   }
// })

// Route for handling canceled PayPal orders
// app.get('/cancel-order', (req, res) => {
//   res.redirect('/'); // Redirect to the homepage when an order is canceled
// });

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
