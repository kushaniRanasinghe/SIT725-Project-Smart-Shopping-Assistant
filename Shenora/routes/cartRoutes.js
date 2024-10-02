// Import necessary modules
const express = require('express'); 
const router = express.Router(); 
const cartController = require('../controllers/cart.controller'); 

// Route for adding a product to the cart
router.post('/add', cartController.addToCart);

// Route for viewing the cart
router.get('/view', cartController.viewCart);

// Route for increasing the quantity of a product in the cart
router.post('/increase/:productId', cartController.increaseQuantity);

// Route for decreasing the quantity of a product in the cart
router.post('/decrease/:productId', cartController.decreaseQuantity);

// Route for removing a product from the cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Export the router so it can be used in other parts of the application
module.exports = router;
