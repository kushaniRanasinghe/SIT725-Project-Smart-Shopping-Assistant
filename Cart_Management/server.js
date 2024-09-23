
require('dotenv').config()
const express = require('express');
const path = require('path');
const paypal = require('./services/paypal')
const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// Define a route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/addProduct', (req, res) => {
    res.sendFile(path.join(__dirname, 'addProduct.html'));
  });

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
});

app.set('view engine', 'ejs')


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


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
