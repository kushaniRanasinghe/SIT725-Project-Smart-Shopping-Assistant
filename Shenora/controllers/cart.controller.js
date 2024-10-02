const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body; 
        const user_id = req.cookies.id
        
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
            
            cart.products[productIndex].quantity += 1;
        } else {
            
            cart.products.push({ productId: productId, quantity: 1, user_id });
        }

        // Save the updated cart to the database
        await cart.save();

        
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
            
            return res.json({ products: [], total: 0 });
        }

        
        const total = cart.products.filter(d => d.user_id == user_id).reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    
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
        const { productId } = req.params; 
        const user_id = req.cookies.id;
        const cart = await Cart.findOne(); // Find the first cart 

        if (!cart) {
            
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the index of the product in the cart
        const productIndex = cart.products.filter(d => d.user_id == user_id).findIndex(p => p.productId.equals(productId));
        if (productIndex > -1) {
            
            cart.products[productIndex].quantity += 1;
            await cart.save(); 
        }

        
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
        const { productId } = req.params; 
        const cart = await Cart.findOne(); // Find the first cart 
        const user_id = req.cookies.id;
        if (!cart) {
           
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the index of the product in the cart
        const productIndex = cart.products.filter(d => d.user_id == user_id).findIndex(p => p.productId.equals(productId));
        if (productIndex > -1 && cart.products[productIndex].quantity > 1) {
            
            cart.products[productIndex].quantity -= 1;
            await cart.save(); 
        }

       
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
        const { productId } = req.params; 
        const cart = await Cart.findOne(); // Find the first cart 
        const user_id = req.cookies.id;
        if (!cart) {
            
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Remove the product with the given productId from the cart
        cart.products = cart.products.filter(p => !p.productId.equals(productId) || p.user_id!=user_id);
        await cart.save(); 

        
        res.json({ success: true });
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
