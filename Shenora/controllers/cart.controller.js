const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body; // Extract productId from the request body
        const user_id = req.cookies.id
        // Find the product in the database by its ID
        const product = await Product.findById(productId);
        if (!product) {
            // If the product is not found, return a 404 error
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Find the existing cart 
        let cart = await Cart.findOne();
        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({ products: [] });
        }

        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(p => p.productId.equals(productId) && p.user_id == user_id);
        if (productIndex > -1) {
            // If the product exists in the cart, increment the quantity
            cart.products[productIndex].quantity += 1;
        } else {
            // If the product is new, add it to the cart with quantity 1
            cart.products.push({ productId: productId, quantity: 1, user_id });
        }

        // Save the updated cart to the database
        await cart.save();

        // Send a success response
        res.json({ success: true, message: 'Product added to cart successfully' });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// View cart
exports.viewCart = async (req, res) => {
    try {
        // Find the cart and populate the product details
        const cart = await Cart.findOne().populate('products.productId');
        const user_id = req.cookies.id;
        if (!cart || cart.products.length === 0) {
            // If the cart is empty, return an empty array with a total of 0
            return res.json({ products: [], total: 0 });
        }

        // Calculate the total cost of the products in the cart
        const total = cart.products.filter(d => d.user_id == user_id).reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

        // Send the cart data as a JSON response
        res.json({ products: cart.products.filter(d => d.user_id == user_id), total });
    } catch (error) {
        // Handle any errors
        console.error('Error fetching the cart:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Increase the quantity of a product in the cart
exports.increaseQuantity = async (req, res) => {
    try {
        const { productId } = req.params; // Extract productId from request params
        const user_id = req.cookies.id;
        const cart = await Cart.findOne(); // Find the first cart 

        if (!cart) {
            // If no cart exists, return a 404 error
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the index of the product in the cart
        const productIndex = cart.products.filter(d => d.user_id == user_id).findIndex(p => p.productId.equals(productId));
        if (productIndex > -1) {
            // If the product is found, increment its quantity
            cart.products[productIndex].quantity += 1;
            await cart.save(); // Save the updated cart
        }

        // Send a success response
        res.json({ success: true });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Decrease the quantity of a product in the cart
exports.decreaseQuantity = async (req, res) => {
    try {
        const { productId } = req.params; // Extract productId from request params
        const cart = await Cart.findOne(); // Find the first cart 
        const user_id = req.cookies.id;
        if (!cart) {
            // If no cart exists, return a 404 error
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the index of the product in the cart
        const productIndex = cart.products.filter(d => d.user_id == user_id).findIndex(p => p.productId.equals(productId));
        if (productIndex > -1 && cart.products[productIndex].quantity > 1) {
            // If the product is found and its quantity is greater than 1, decrement it
            cart.products[productIndex].quantity -= 1;
            await cart.save(); // Save the updated cart
        }

        // Send a success response
        res.json({ success: true });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params; // Extract productId from request params
        const cart = await Cart.findOne(); // Find the first cart 
        const user_id = req.cookies.id;
        if (!cart) {
            // If no cart exists, return a 404 error
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Remove the product with the given productId from the cart
        cart.products = cart.products.filter(p => !p.productId.equals(productId) || p.user_id!=user_id);
        await cart.save(); // Save the updated cart

        // Send a success response
        res.json({ success: true });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
