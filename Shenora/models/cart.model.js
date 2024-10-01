const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

// Define the schema for the cart collection in MongoDB
const cartSchema = new mongoose.Schema({
    // Array of products added to the cart
    products: [
        {
            // productId stores the reference to the product document from the 'Product' collection
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            // quantity represents how many of the product have been added to the cart, defaults to 1
            quantity: { type: Number, default: 1 },
            user_id: { type: String }
        }
    ]
});

// Export the Cart model, which corresponds to the 'cart' collection in MongoDB
module.exports = mongoose.model('Cart', cartSchema);
