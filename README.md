## Marble & Tiles Delivery Web App

Marble & Tiles Delivery Web App is an e-commerce platform for browsing, managing, and ordering tiles and marble products online. The application allows users to explore product catalogs, manage inventory, and handle orders through a modern full-stack web interface.

This README provides setup instructions for both the frontend and backend, along with documentation of API endpoints, routes, and example responses.


---

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and configure the following variables:
   ```
   PORT=5000
   MONGODB_URI=<your_mongodb_connection_string>
   MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8
   # Optional: use Atlas "standard" (non-SRV) URI if DNS keeps failing locally
   # MONGODB_URI_STANDARD=mongodb://user:pass@host1:27017,host2:27017/db?ssl=true&authSource=admin
   JWT_SECRET=<your_jwt_secret>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
   SELLER_EMAIL=<your_seller_email>
   SELLER_PASSWORD=<your_seller_password>
   ```
4. Start the backend server:
   ```bash
   npx nodemon
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and configure the following variables:
   ```
   VITE_BASE_URL=http://localhost:5000
   VITE_CURRENCY=₹
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### Authentication
#### POST `/api/users/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "12345",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### POST `/api/users/login`
- **Description**: Log in a user.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### GET `/api/users/logout`
- **Description**: Log out a user.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

---

### Products
#### GET `/api/product/list`
- **Description**: Fetch all products.
- **Response**:
  ```json
  {
    "success": true,
    "products": [
      {
        "id": "1",
        "name": "Apple",
        "price": 120,
        "offerPrice": 110,
        "category": "Fruits",
        "inStock": true
      },
      {
        "id": "2",
        "name": "Milk",
        "price": 60,
        "offerPrice": 55,
        "category": "Dairy",
        "inStock": true
      }
    ]
  }
  ```

#### POST `/api/product/add`
- **Description**: Add a new product (Admin only).
- **Request Body**:
  ```json
  {
    "productData": {
      "name": "Banana",
      "price": 50,
      "offerPrice": 45,
      "category": "Fruits",
      "description": ["Fresh and ripe", "Rich in potassium"]
    },
    "images": [<image_files>]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product added successfully"
  }
  ```

#### POST `/api/product/stock`
- **Description**: Update product stock status (Admin only).
- **Request Body**:
  ```json
  {
    "id": "1",
    "inStock": false
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Stock updated successfully"
  }
  ```

---

### Orders
#### POST `/api/order/cod`
- **Description**: Place a new order with Cash on Delivery.
- **Request Body**:
  ```json
  {
    "items": [
      { "product": "1", "quantity": 2 },
      { "product": "2", "quantity": 1 }
    ],
    "address": "address_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order placed successfully"
  }
  ```

#### POST `/api/order/stripe`
- **Description**: Place a new order with Stripe payment.
- **Request Body**:
  ```json
  {
    "items": [
      { "product": "1", "quantity": 2 },
      { "product": "2", "quantity": 1 }
    ],
    "address": "address_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "url": "https://checkout.stripe.com/..."
  }
  ```

#### GET `/api/order/user`
- **Description**: Fetch all orders for a user.
- **Response**:
  ```json
  {
    "success": true,
    "orders": [
      {
        "id": "67890",
        "items": [
          { "product": "1", "quantity": 2 },
          { "product": "2", "quantity": 1 }
        ],
        "amount": 500,
        "status": "Order Placed",
        "paymentType": "COD"
      }
    ]
  }
  ```

#### GET `/api/order/seller`
- **Description**: Fetch all orders for the seller.
- **Response**:
  ```json
  {
    "success": true,
    "orders": [
      {
        "id": "67890",
        "items": [
          { "product": "1", "quantity": 2 },
          { "product": "2", "quantity": 1 }
        ],
        "amount": 500,
        "status": "Order Placed",
        "paymentType": "COD"
      }
    ]
  }
  ```

---

### Additional Notes
- Ensure the backend server is running on `http://localhost:5000` and the frontend on `http://localhost:5173`.
- Replace placeholder values in `.env` files with your actual credentials.
