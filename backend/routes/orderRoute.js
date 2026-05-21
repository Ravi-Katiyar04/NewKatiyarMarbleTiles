import express from 'express';
import {
    placedOrderCOD,
    getUserOrders,
    getUserOrderById,
    getAllOrders,
    placedOrderStripe,
    updateBookingStatus,
    getBookingReceipt,
} from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js'; // Import the authentication middleware
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();


// Route to create a new order
orderRouter.post('/cod', authUser, placedOrderCOD); 

// Route to get all orders for a user
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/user/:id', authUser, getUserOrderById);

// Route to get all orders for admin
orderRouter.get('/seller', authSeller, getAllOrders); // For admin

// Route to create a new order with Stripe
orderRouter.post('/stripe', authUser, placedOrderStripe);

// User: receipt data for confirmed booking
orderRouter.get('/:id/receipt', authUser, getBookingReceipt);

// Seller: confirm or reject booking
orderRouter.put('/:id/status', authSeller, updateBookingStatus);

export default orderRouter;