
// Add product to cart
function addToCart(productId) {
  // Sending a POST request
  fetch('/cart/add', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ productId: productId })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        
        alert("Product added to cart successfully!");
        window.location.href = '/Cart'; 
      } else {
        alert("Failed to add product to cart."); 
      }
    })
    .catch(error => {
      console.error('Error:', error); // Log any errors that occur during the request
    });
}

// Remove product from cart
function removeFromCart(productId) {
  // Sending a DELETE request
  fetch(`/cart/remove/${productId}`, { method: 'DELETE' })
    .then(response => response.json()) 
    .then(data => {
      if (data.success) {
        
        cart = cart.filter(item => item.productId._id !== productId);

        
        document.getElementById(`cart-item-${productId}`).remove();

        
        if (cart.length === 0) {
          document.getElementById('cartItems').innerHTML = `
                  <div class="empty-cart">
                      <p>Your cart is empty. Add some products!</p>
                      <button onclick="shopNow()">Shop Now</button>
                  </div>
              `;
        }

        
        updateCartSummary();
      } else {
        alert("Failed to remove product from cart."); 
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
      product.quantity++; 
      document.getElementById(`quantity-${productId}`).textContent = product.quantity; 
      updateCartSummary(); 
    })
  }
}

// Decrease product quantity in the cart
function decreaseQuantity(productId) {
  const product = cart.find(item => item.productId._id === productId);
  if (product && product.quantity > 1) {
    fetch(`/cart/decrease/${productId}`, { method: 'POST' })
      .then(e => {
        product.quantity--; 
        document.getElementById(`quantity-${productId}`).textContent = product.quantity; 
        updateCartSummary(); 
      })
  }
}

// Calculate the total price of all items in the cart
function calculateTotal() {
  
  return cart.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2);
}


function calculateDiscountAndDelivery(baseTotal) {
  let discount = 0;
  let discountPercentage = 0;
  let deliveryFee = 0;

  
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

  
  if (baseTotal < 50) {
    deliveryFee = baseTotal * 0.10;
  }

  return { discount, discountPercentage, deliveryFee };
}

// Update the cart summary 
function updateCartSummary() {
  const baseTotal = calculateTotal(); 
  const { discount, discountPercentage, deliveryFee } = calculateDiscountAndDelivery(baseTotal); 
  const finalTotal = (baseTotal - discount + deliveryFee).toFixed(2); 

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
    .then(response => response.json()) 
    .then(data => {
      cart = data.products; 
      cartItemsDiv.innerHTML = ''; 

      if (cart.length === 0) {
        
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

        updateCartSummary(); 
      }
    })
    .catch(error => {
      console.error('Error fetching cart data:', error); // Log any errors that occur during the request
    });
}

// Handle the checkout process
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty."); 
  } else {
    const baseTotal = calculateTotal(); 
    const { discount, deliveryFee } = calculateDiscountAndDelivery(baseTotal); 
    const finalTotal = (baseTotal - discount + deliveryFee).toFixed(2); 

    alert(`Final Total Amount: $${finalTotal}. Proceeding to payment...`); 
    window.location.href = `Payment?base=${baseTotal}&discount=${discount}&delivery=${deliveryFee}&total=${finalTotal}`; 
  }
}

// Redirect to the shop page
function shopNow() {
  window.location.href = '/products/shop'; 
}

// Call this function to update the cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);
