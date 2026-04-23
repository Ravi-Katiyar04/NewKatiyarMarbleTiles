import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import connectDB from './configs/db.js';
import 'dotenv/config';// Load environment variables from .env file
import userRouter from './routes/UserRoute.js';// Import the user router
import connectCloudinary from './configs/cloudinary.js'; // Import the Cloudinary configuration
import sellerRouter from './routes/sellerRoute.js'; // Import the seller router
import productRouter from './routes/productRoute.js'; // Import the product router
import cartRouter from './routes/cartRoute.js'; // Import the cart router
import addressRouter from './routes/addressRoute.js'; // Import the address router
import orderRouter from './routes/orderRoute.js'; // Import the order router
import enquiryRouter from './routes/enquiryRoute.js';
import { stripeWebhook } from './controllers/orderController.js';




const app = express();
const port = process.env.PORT || 4000;

await connectDB(); // Connect to MongoDB
await connectCloudinary(); // Connect to Cloudinary

const allowedOrigins = [
    'http://localhost:5173', // React frontend
    'https://newkatiyarmarbletiles.onrender.com',
];

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook); // Stripe webhook endpoint

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true })); // Allow requests from the frontend

app.get('/', (req, res) => {
    res.send(`Hello World! This is the backend server.`);
});

app.use('/api/users', userRouter); // Use the user router for user-related routes

app.use('/api/seller', sellerRouter); // Use the seller router for seller-related routes

app.use('/api/product', productRouter); // Use the product router for product-related routes

app.use('/api/cart', cartRouter); // Use the cart router for cart-related routes

app.use('/api/address', addressRouter); // Use the address router for address-related routes

app.use('/api/order', orderRouter); // Use the order router for order-related routes

app.use('/api/enquiry', enquiryRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
