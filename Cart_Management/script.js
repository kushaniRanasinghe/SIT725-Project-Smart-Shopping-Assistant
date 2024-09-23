let cart = [];

// Sample product data
const products = [
  { id: 1, name: "Cute Graphic T-Shirt", price: 19.99, quantity: 1, image: "images/t-shirt.webp" },
  { id: 2, name: "Comfortable Slippers", price: 29.99, quantity: 1, image: "images/shoe.webp" },
  { id: 3, name: "Men's Polo Shirt", price: 45.99, quantity: 1, image: "images/men.webp" }
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

// Update the Quantity (Decrease)
function decreaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product && product.quantity > 1) {
    product.quantity--;
    updateCartDisplay();
  }
}

// Update the Quantity (Increase)
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

// Calculate discount and delivery fee
function calculateDiscountAndDelivery(baseTotal) {
  let discount = 0;
  let discountPercentage = 0;
  let deliveryFee = 0;

  // Calculate discount based on the total
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

  // Calculate delivery fee
  if (baseTotal < 50) {
    deliveryFee = baseTotal * 0.10;
  }

  return { discount, discountPercentage, deliveryFee };
}

function updateCartSummary() {
  const baseTotal = calculateTotal();
  const { discount, discountPercentage, deliveryFee } = calculateDiscountAndDelivery(baseTotal);
  const finalTotal = (baseTotal - discount + deliveryFee).toFixed(2);

  document.getElementById('baseTotal').textContent = `$${baseTotal}`;
  document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
  document.getElementById('discountPercentage').textContent = (discountPercentage).toFixed(0);
  document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
  document.getElementById('cartTotal').textContent = `$${finalTotal}`;
}

// Update cart display
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = ''; 

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty. Add some products!</p>
        <button onclick="shopNow()">Shop Now</button>
      </div>
    `;
  }else {
    cart.forEach(item => {
      cartItemsDiv.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" style="width:80px;">
          <span>${item.name}</span>
          <span>$${item.price.toFixed(2)}</span>
          <div class="quantity-control">
            <button style="background-color: black; color: white; border: 1px solid black; padding: 5px 10px; font-size: 16px; cursor: pointer; border-radius: 5px;" onclick="decreaseQuantity(${item.id})">-</button>
            <span id="quantity-${item.id}">${item.quantity}</span>
            <button style="background-color: black; color: white; border: 1px solid black; padding: 5px 10px; font-size: 16px; cursor: pointer; border-radius: 5px;" onclick="increaseQuantity(${item.id})">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      `;
    });
  }

  // Update the summary totals
  updateCartSummary();
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
  window.location.href = 'products.html';
}



// Initialize the cart with sample products
products.forEach(product => addToCart(product));
