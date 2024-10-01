
// Add product to cart
function addToCart(productId) {
  // Sending a POST request to the '/cart/add' endpoint to add the selected product to the cart
  fetch('/cart/add', {
    method: 'POST', // HTTP method POST for adding data
    headers: {
      'Content-Type': 'application/json' // Specifying that the request body will be in JSON format
    },
    body: JSON.stringify({ productId: productId }) // Passing the productId in the request body
  })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      if (data.success) {
        // If the request was successful, show an alert
        alert("Product added to cart successfully!");
        window.location.href = '/Cart'; // Redirect to the Cart page after adding the product
      } else {
        alert("Failed to add product to cart."); // Show an error message if adding fails
      }
    })
    .catch(error => {
      console.error('Error:', error); // Log any errors that occur during the request
    });
}

// Remove product from cart
function removeFromCart(productId) {
  // Sending a DELETE request to the server to remove the product from the cart
  fetch(`/cart/remove/${productId}`, { method: 'DELETE' })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      if (data.success) {
        // Filter the cart array locally to remove the product with the matching productId
        cart = cart.filter(item => item.productId._id !== productId);

        // Remove the product's HTML element from the DOM
        document.getElementById(`cart-item-${productId}`).remove();

        // If the cart is empty after removing the product, show an empty cart message
        if (cart.length === 0) {
          document.getElementById('cartItems').innerHTML = `
                  <div class="empty-cart">
                      <p>Your cart is empty. Add some products!</p>
                      <button onclick="shopNow()">Shop Now</button>
                  </div>
              `;
        }

        // Update the cart summary after the product has been removed
        updateCartSummary();
      } else {
        alert("Failed to remove product from cart."); // Show an error message if removal fails
      }
    })
    .catch(error => {
      console.error("Error:", error); // Log any errors that occur during the request
    });
}

// Increase product quantity in the cart
function increaseQuantity(productId) {
  const product = cart.find(item => item.productId._id === productId);
  if (product) {
    fetch(`/cart/increase/${productId}`, { method: 'POST' }).then(e => {
      product.quantity++; // Increment the quantity of the product
      document.getElementById(`quantity-${productId}`).textContent = product.quantity; // Update the displayed quantity
      updateCartSummary(); // Update the cart summary to reflect the new quantity
    })
  }
}

// Decrease product quantity in the cart
function decreaseQuantity(productId) {
  const product = cart.find(item => item.productId._id === productId);
  if (product && product.quantity > 1) {
    fetch(`/cart/decrease/${productId}`, { method: 'POST' })
      .then(e => {
        product.quantity--; // Decrease the quantity of the product
        document.getElementById(`quantity-${productId}`).textContent = product.quantity; // Update the displayed quantity
        updateCartSummary(); // Update the cart summary to reflect the new quantity
      })
  }
}

// Calculate the total price of all items in the cart
function calculateTotal() {
  // Sum the price of each product multiplied by its quantity
  return cart.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2);
}

// Calculate discount and delivery fee based on the total price
function calculateDiscountAndDelivery(baseTotal) {
  let discount = 0;
  let discountPercentage = 0;
  let deliveryFee = 0;

  // Apply discount based on the total price
  if (baseTotal >= 50 && baseTotal < 100) {
    discountPercentage = 15;
    discount = baseTotal * 0.15;
  } else if (baseTotal >= 100 && baseTotal < 200) {
    discountPercentage = 20;
    discount = baseTotal * 0.20;
  } else if (baseTotal >= 200) {
    discountPercentage = 30;
    discount = baseTotal * 0.30;
  }

  // Apply a delivery fee if the total is below $50
  if (baseTotal < 50) {
    deliveryFee = baseTotal * 0.10;
  }

  return { discount, discountPercentage, deliveryFee };
}

// Update the cart summary (subtotal, discount, delivery fee, and total)
function updateCartSummary() {
  const baseTotal = calculateTotal(); // Calculate the total price
  const { discount, discountPercentage, deliveryFee } = calculateDiscountAndDelivery(baseTotal); // Calculate discount and fees
  const finalTotal = (baseTotal - discount + deliveryFee).toFixed(2); // Calculate final total

  // Update the DOM elements with the calculated totals
  document.getElementById('baseTotal').textContent = `$${baseTotal}`;
  document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
  document.getElementById('discountPercentage').textContent = discountPercentage.toFixed(0);
  document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${finalTotal}`;
}

// Fetch and display the cart data from the server
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cartItems');

  // Fetch the cart data from the server
  fetch('/cart/view')
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      cart = data.products; // Store the cart data in the local cart array
      cartItemsDiv.innerHTML = ''; // Clear the current cart display

      if (cart.length === 0) {
        // If the cart is empty, display a message and a button to shop now
        cartItemsDiv.innerHTML = `
              <div class="empty-cart">
                  <p>Your cart is empty. Add some products!</p>
                  <button onclick="shopNow()">Shop Now</button>
              </div>
          `;
      } else {
        // Populate the cart with items from the server
        cart.forEach(item => {
          cartItemsDiv.innerHTML += `
                  <div class="cart-item" id="cart-item-${item.productId._id}">
                      <img src="/uploads/${item.productId.image}" alt="${item.productId.title}" style="width:80px;">
                      <span>${item.productId.title}</span>
                      <span>$${item.productId.price.toFixed(2)}</span>
                      <div class="quantity-control">
                          <button style="background-color: black; color: white; border: 1px solid black; padding: 5px 10px; font-size: 16px; cursor: pointer; border-radius: 5px;" onclick="decreaseQuantity('${item.productId._id}')">-</button>
                          <span id="quantity-${item.productId._id}">${item.quantity}</span>
                          <button style="background-color: black; color: white; border: 1px solid black; padding: 5px 10px; font-size: 16px; cursor: pointer; border-radius: 5px;" onclick="increaseQuantity('${item.productId._id}')">+</button>
                      </div>
                      <button class="remove-btn" onclick="removeFromCart('${item.productId._id}')">Remove</button>
                  </div>
              `;
        });

        updateCartSummary(); // Update the cart summary after displaying the items
      }
    })
    .catch(error => {
      console.error('Error fetching cart data:', error); // Log any errors that occur during the request
    });
}

// Handle the checkout process
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty."); // Alert if the cart is empty
  } else {
    const baseTotal = calculateTotal(); // Calculate total price
    const { discount, deliveryFee } = calculateDiscountAndDelivery(baseTotal); // Calculate discount and fees
    const finalTotal = (baseTotal - discount + deliveryFee).toFixed(2); // Calculate final total

    alert(`Final Total Amount: $${finalTotal}. Proceeding to payment...`); // Show the final total and proceed to payment
    window.location.href = `Payment?base=${baseTotal}&discount=${discount}&delivery=${deliveryFee}&total=${finalTotal}`; // Redirect to the payment page
  }
}

// Redirect to the shop page
function shopNow() {
  window.location.href = '/products/shop'; // Redirect to the shop page
}

// Call this function to update the cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);
