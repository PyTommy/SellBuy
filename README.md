# SellBuy

SellBuy is a web application with which users can sell and buy products.

## Features
- Responsive design.
- **Login / Signup**.
- Automatically logged in as long as **web token** is still valid.
- Updating user profile(username, email, password, avatar).
- **Image upload** (Saved as binary data on mongoDB)
- **CRUD** operations for products.
- **Filtering** products by text or category.
- Commenting.
- Likes.
- Messaging (HTTP).
- Nortification (HTTP)
  + Commenting on a product trigger sending notification to product  owner and the others who commented on the same product.
  + Purchasing or cancelling a product trigger sending notification to  product owner.
  + Rejecting a purchase triggers sending notification to the purchaser.

## Technologies
- Sass
- React & Hooks
- Redux
- Express.js
- MongoDB
- Jest (some routes of REST API)
