let cart = [];

// Sample product data
const products = [
  { id: 1, name: "Product A", price: 25.99, quantity: 1, image: "images/t-shirt.webp" },
  { id: 2, name: "Product B", price: 15.99, quantity: 1, image: "images/shoe.webp" },
  { id: 3, name: "Product C", price: 35.49, quantity: 1, image: "images/men.webp" }
];

// Add product to cart
function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product });
  }
  updateCartDisplay();
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
}

//Update the Quantity (Decrease)
function decreaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product && product.quantity > 1) {
    product.quantity--;
    updateCartDisplay();
  }
}

//Update the Quantity (Increase)
function increaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity++;
    updateCartDisplay();
  }
}


// Calculate total price
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

// Update cart display
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');
  cartItemsDiv.innerHTML = ''; // Clear existing items

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty. Add some products!</p>
        <button onclick="shopNow()">Shop Now</button>
      </div>
    `;
  } else {
    cartItemsDiv.innerHTML = `
      <div class="cart-header">
        <div>Image</div>
        <div>Product</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Remove</div>
      </div>
    `;

    cart.forEach(item => {
      cartItemsDiv.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <span>${item.name}</span>
          <span>$${item.price.toFixed(2)}</span>
          <div class="quantity-control">
            <button class="quantity-btn" onclick="decreaseQuantity(${item.id})" 
              style="background-color: black; color: white">-</button>
            <span id="quantity-${item.id}">${item.quantity}</span>
            <button class="quantity-btn" onclick="increaseQuantity(${item.id})"
              style="background-color: black; color: white">+</button>
          </div>
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;
    });
  }

  cartTotalSpan.textContent = calculateTotal();
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
  } else {
    alert(`Total Amount: $${calculateTotal()}. Proceeding to payment...`);
  }
}

// Shop now button (redirect or logic)
function shopNow() {
  alert('Redirecting to shop...');
  // Logic to redirect to shop page can be added here
}

// Initialize the cart with sample products
products.forEach(product => addToCart(product));
