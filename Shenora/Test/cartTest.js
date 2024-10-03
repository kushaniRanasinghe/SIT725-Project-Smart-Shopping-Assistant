// cartTest.js
import * as chai from 'chai';   
import request from 'supertest';  
import { app } from '../server.js';  

const { expect } = chai;

describe('Shopping Cart Integration Tests', () => {

  let productId1 = '66fcb00400a5d5f88286d644'; 
  let productId2 = '66fca72c60c64c0003453387';
  let cartId;

  // Test 1: Add a product to the cart
  it('should add a product to the cart', async () => {
    const response = await request(app)
      .post('/cart/add')
      .send({ productId: productId1 })
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    cartId = response.body.cartId;
  });

  // Test 2: Add a second product to the cart
  it('should add another product to the cart', async () => {
    const response = await request(app)
      .post('/cart/add')
      .send({ productId: productId2 })
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
  });

  // Test 3: Verify cart contains correct products
  it('should fetch the cart and contain both products', async () => {
    const response = await request(app)
      .get('/cart/view')
      .set('Accept', 'application/json');

    const cart = response.body.products;
    expect(cart).to.have.lengthOf(2);  // Check if both products are present
    expect(cart.some(item => item.productId === productId1)).to.be.true;
    expect(cart.some(item => item.productId === productId2)).to.be.true;
  });

  // Test 4: Increase quantity of a product
  it('should increase the quantity of product 1', async () => {
    const response = await request(app)
      .post(`/cart/increase/${productId1}`)
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;

    const cartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    const product = cartResponse.body.products.find(p => p.productId === productId1);
    expect(product.quantity).to.equal(2);  // Quantity should be 2 now
  });

  // Test 5: Decrease quantity of a product
  it('should decrease the quantity of product 1', async () => {
    const response = await request(app)
      .post(`/cart/decrease/${productId1}`)
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;

    const cartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    const product = cartResponse.body.products.find(p => p.productId === productId1);
    expect(product.quantity).to.equal(1);  // Quantity should be decreased back to 1
  });

  // Test 6: Remove product from cart
  it('should remove a product from the cart', async () => {
    const response = await request(app)
      .delete(`/cart/remove/${productId1}`)
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;

    const cartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    const cart = cartResponse.body.products;
    expect(cart.some(item => item.productId === productId1)).to.be.false;  // Product should be removed
  });

  // Test 7: Check if the total price is calculated correctly
  it('should calculate the correct total price', async () => {
    const response = await request(app)
      .get('/cart/view')
      .set('Accept', 'application/json');

    const totalPrice = response.body.products.reduce((total, item) => total + item.productId.price * item.quantity, 0);
    expect(totalPrice).to.be.above(0);  // Total price should be calculated correctly
  });

  // Test 8: Apply discount correctly based on the total price
  it('should apply the correct discount', async () => {
    const response = await request(app)
      .get('/cart/view')
      .set('Accept', 'application/json');

    const baseTotal = response.body.total;
    const { discount } = response.body;

    if (baseTotal >= 100) {
      expect(discount).to.be.equal(baseTotal * 0.20);  // 20% discount for totals above 100
    }
  });

  // Test 9: Apply correct delivery fee based on the total price
  it('should apply delivery fee if total is below threshold', async () => {
    const response = await request(app)
      .get('/cart/view')
      .set('Accept', 'application/json');

    const baseTotal = response.body.total;
    const { deliveryFee } = response.body;

    if (baseTotal < 50) {
      expect(deliveryFee).to.be.above(0);  // Delivery fee should be applied for totals below $50
    } else {
      expect(deliveryFee).to.equal(0);  // No delivery fee for totals above $50
    }
  });

  // Test 10: Attempt to decrease quantity below 1
  it('should not allow decreasing quantity below 1', async () => {
    const response = await request(app)
      .post(`/cart/decrease/${productId2}`)
      .set('Accept', 'application/json');

    const cartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    const product = cartResponse.body.products.find(p => p.productId === productId2);
    expect(product.quantity).to.equal(1);  // Quantity should not go below 1
  });

  // Test 11: Proceed to checkout with empty cart
  it('should not allow checkout if cart is empty', async () => {
    const response = await request(app)
      .get('/cart/checkout')
      .set('Accept', 'application/json');

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Your cart is empty.');
  });

  // Test 12: Clear all items from the cart
  it('should clear all items from the cart', async () => {
    const response = await request(app)
      .post('/cart/clear')
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;

    const cartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    expect(cartResponse.body.products).to.have.lengthOf(0);  // Cart should be empty
  });

  // Test 13: Add product with invalid ID
  it('should return error for invalid product ID', async () => {
    const response = await request(app)
      .post('/cart/add')
      .send({ productId: 'invalid' })
      .set('Accept', 'application/json');

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid product ID');
  });

  // Test 14: Get cart details with invalid cart ID
  it('should return error for invalid cart ID', async () => {
    const response = await request(app)
      .get('/cart/view?cartId=invalid')
      .set('Accept', 'application/json');

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal('Cart not found');
  });

  // Test 15: Check discount is not applied for low totals
  it('should not apply discount for totals below $50', async () => {
    const response = await request(app)
      .get('/cart/view')
      .set('Accept', 'application/json');

    const { discount } = response.body;
    expect(discount).to.equal(0);  // No discount should be applied for low totals
  });

  // Test 16: Add duplicate product to cart
  it('should increase quantity if product is added twice', async () => {
    await request(app)
      .post('/cart/add')
      .send({ productId: productId2 })
      .set('Accept', 'application/json');
    
    const response = await request(app)
      .post('/cart/add')
      .send({ productId: productId2 })
      .set('Accept', 'application/json');
    
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;

    const cartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    const product = cartResponse.body.products.find(p => p.productId === productId2);
    expect(product.quantity).to.equal(2);  // Quantity should be increased
  });

  // Test 17: Add product with special characters in ID
  it('should return error for product ID with special characters', async () => {
    const response = await request(app)
      .post('/cart/add')
      .send({ productId: 'invalid#@$!' })
      .set('Accept', 'application/json');

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid product ID');
  });

  // Test 18: Ensure cart total updates correctly after product removal
  it('should update the cart total correctly after removing a product', async () => {
    await request(app)
      .post('/cart/add')
      .send({ productId: productId1 })
      .set('Accept', 'application/json');

    const initialCartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    const initialTotal = initialCartResponse.body.total;

    await request(app).delete(`/cart/remove/${productId1}`).set('Accept', 'application/json');
    
    const finalCartResponse = await request(app).get('/cart/view').set('Accept', 'application/json');
    const finalTotal = finalCartResponse.body.total;

    expect(finalTotal).to.be.lessThan(initialTotal);  // Total should be less after removing product
  });

  // Test 19: Attempt to fetch cart with no items
  it('should return empty cart message if there are no items', async () => {
    const response = await request(app)
      .get('/cart/view')
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.products).to.have.lengthOf(0);  // Cart should be empty
  });

  // Test 20: Checkout process with valid cart
  it('should allow checkout with valid items in cart', async () => {
    await request(app)
      .post('/cart/add')
      .send({ productId: productId2 })
      .set('Accept', 'application/json');

    const response = await request(app)
      .get('/cart/checkout')
      .set('Accept', 'application/json');

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.message).to.equal('Proceeding to checkout');
  });
});
