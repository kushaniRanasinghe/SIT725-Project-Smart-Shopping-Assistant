const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

// Define the schema for the cart collection in MongoDB
const cartSchema = new mongoose.Schema({
    
    products: [
        {
            
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            user_id: { type: String }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);
