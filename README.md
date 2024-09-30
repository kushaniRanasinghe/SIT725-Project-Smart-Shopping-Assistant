Online Shopping Assistant

Overview

The Online Shopping Assistant is a full-featured e-commerce platform designed to streamline and enhance the shopping experience. It integrates key functionalities such as user profile management, product management, shopping cart operations, and secure payment handling. The platform is built using Node.js, Express.js, and MongoDB, providing a seamless user experience from product discovery to secure checkout.

Features

1. Profile Management
User Registration and Login: Users can create accounts, log in, and manage their profile securely.
User Authentication: Supports secure login and logout, with session management.
Profile Update: Users can update their personal information, such as name, email, and password.
Password Recovery: A feature for users to reset their password if forgotten.
2. Product Management
Admin Dashboard: Admins can manage the entire product catalog, including adding, updating, and deleting products.
Product Search and Filtering: Users can search products by name, category, and apply filters such as price range and ratings.
Product Display: Each product page displays detailed information, including price, description, images, and reviews.
Inventory Management: Admins can update stock levels and ensure product availability.
3. Cart Management
Add to Cart: Users can add products to their shopping cart from the product page.
Update Cart: Users can modify quantities of items in their cart or remove them.
Discount and Shipping Calculation: The cart dynamically calculates discounts and shipping fees based on the order details.
Real-Time Total Calculation: The cart automatically updates the total price, including discounts and shipping fees.
Empty Cart Management: If the cart is empty, users are prompted with a message and options to continue shopping.
4. Payment Management
Checkout Process: Users can review their cart and complete purchases by selecting a payment method.
Secure Payment Integration: The platform integrates secure payment gateways such as PayPal or Stripe, ensuring all transactions are secure.
Order Confirmation: After successful payment, users receive a confirmation email with order details.
Order History: Users can view their past orders and track delivery statuses in their profile.

Prerequisites

Ensure you have the following installed:

        Node.js (v12.x or later)
        MongoDB Atlas or a local MongoDB setup
        Git

Installation

1. Clone the repository:

        git clone https://github.com/kushaniRanasinghe/SIT725_Online_Shopping_Assistant.git
        cd online-shopping-assistant

2. Install dependencies:

        npm install

3. Set up environment variables: Create a .env file in the root directory and add the following:

        MONGO_URI=mongodb+srv://<your-username>:<your password>@cluster0.mongodb.net/<your-database>
        PORT=3000

4. Run the server:

        npm start

The app will run on http://localhost:3000.

Usage

1. User Registration: Users can sign up for an account.
2. Browse Products: Use the search bar to browse products or apply filters to narrow down the results.
3. Manage Cart: Add, update, or remove items in the cart, with real-time total calculations.
4. Checkout: Proceed to checkout, choose a payment method, and finalize the purchase.
5. Admin Dashboard: Admins can log in to manage products, users, and orders.

Key Functionality

1. Profile Management
   
Secure Account Management: Users can securely register, log in, and update their profile details.

2. Product Management
   
CRUD Operations for Products: Admins can add, update, and remove products from the catalog.

Search and Filter Products: Users can search and filter products by various criteria like price, category, and reviews.

3. Cart Management
   
Real-Time Cart Updates: Users can add and modify items in their cart, and see updated totals with discounts and shipping applied.

Empty Cart Handling: Displays an empty cart message if no items are added.

4. Payment Management
   
Secure Payment Gateway: Integrates secure payment methods such as PayPal or Stripe.

Order Confirmation: Users receive a confirmation of the payment and order details via email.

Order History: Users can access their past orders and track shipments.



Testing

The platform includes tests for functionality and integration.

1. Run tests:

           npm test
   
2. Test Coverage:

Unit testing for all key features such as cart, products, and user operations.
Integration testing to ensure the database and front-end work together.

Technologies Used

1. Backend: Node.js with Express.js for server-side logic.

2. Database: MongoDB and Mongoose for managing user, product, and cart data.

3. Frontend: HTML, CSS, and JavaScript for building the user interface.

4. Payment Gateway: Integration with PayPal or Stripe for secure payments.

Contribution

If you want to contribute to this project:

        Fork the repository.
        Create a new branch (feature/your-feature).
        Commit your changes.
        Push your branch to your forked repository.
        Submit a pull request explaining your changes.

License

This project is licensed under the MIT License.

Authors

1. Kushani Ranasinghe (Cart Management)

2. Jayani Vithanage (Product Management)

3. Divyanga Lokuhetti (User Management)

4. Heramabage Balasuriya (Payment Management)
