// Import necessary modules
const express = require('express'); // Import the Express framework for routing
const router = express.Router(); // Create an instance of the Express router
const cartController = require('../controllers/cart.controller'); // Import the cart controller that contains the logic for handling cart operations

// Route for adding a product to the cart
// When a POST request is made to '/cart/add', it will trigger the 'addToCart' method in the 'cartController'
router.post('/add', cartController.addToCart);

// Route for viewing the cart
// When a GET request is made to '/cart/view', it will trigger the 'viewCart' method in the 'cartController'
router.get('/view', cartController.viewCart);

// Route for increasing the quantity of a product in the cart
// The ':productId' is a URL parameter that will be passed to the 'increaseQuantity' method in the 'cartController'
router.post('/increase/:productId', cartController.increaseQuantity);

// Route for decreasing the quantity of a product in the cart
// The ':productId' is a URL parameter that will be passed to the 'decreaseQuantity' method in the 'cartController'
router.post('/decrease/:productId', cartController.decreaseQuantity);

// Route for removing a product from the cart
// The ':productId' is a URL parameter that will be passed to the 'removeFromCart' method in the 'cartController'
router.delete('/remove/:productId', cartController.removeFromCart);

// Export the router so it can be used in other parts of the application
module.exports = router;
