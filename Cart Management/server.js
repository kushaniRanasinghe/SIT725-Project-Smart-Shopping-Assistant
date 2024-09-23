// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// Define a route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
