import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import stripe from "stripe";
import { createNotification } from "../utils/createNotification.js";

export const placedOrderCOD= async (req, res) => {
    try {
        const { items } = req.body;
        const {userId} = req;
        if (!items?.length) {
            return res.json({success: false, message: "Invalid order data" });
        }

        let amount= await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            const currentAcc = await acc; // Wait for the previous promise to resolve
            return currentAcc + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02); // Adding 2% TAX

        await Order.create({
            userId,
            items,
            amount,
            paymentType: "COD",
        });
        return res.json({success: true, message: "Order placed successfully" });
        

    } catch (error) {
        console.error("Error creating order:", error.message);
        return res.json({success: false, message: error.message });
    }
}


export const placedOrderStripe= async (req, res) => {
    try {
        const { items } = req.body;
        const {userId} = req;

        const {origin} = req.headers;
        if (!items?.length) {
            return res.json({success: false, message: "Invalid order data" });
        }

        let productData= [];

        let amount= await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            const currentAcc = await acc; // Wait for the previous promise to resolve
            return currentAcc + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02); // Adding 2% TAX

        const depositPercent = 10;
        const depositAmount = Math.max(1, Math.round(amount * (depositPercent / 100)));

        const order=await Order.create({
            userId,
            items,
            amount,
            paidAmount: 0,
            depositPercent,
            paymentType: "Online",
        });

        const stripeInstance =new stripe(process.env.STRIPE_SECRET_KEY);

        // Charge only the booking deposit (10%) and keep the full amount in DB for later settlement.
        const line_items = [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: `Booking deposit (${depositPercent}%)`,
                    },
                    unit_amount: depositAmount * 100,
                },
                quantity: 1,
            },
        ];

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
                depositAmount: depositAmount.toString(),
            },
        });


        return res.json({success: true, url: session.url });
    
    } catch (error) {
        console.error("Error creating order:", error.message);
        return res.json({success: false, message: error.message });
    }
}

export const verifyStripePayment = async (req, res) => {
    try {
        const { sessionId } = req.query;
        const { userId } = req;

        if (!sessionId) {
            return res.json({ success: false, message: "Session ID required" });
        }

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        if (session && (session.payment_status === "paid" || session.status === "complete")) {
            const { orderId, depositAmount } = session.metadata || {};
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    isPaid: true,
                    paidAmount: Number(depositAmount || 0),
                });
            }
            if (userId) {
                await User.findByIdAndUpdate(userId, { cartItems: {} });
            }
            return res.json({ success: true, message: "Payment verified successfully" });
        }

        return res.json({ success: false, message: "Payment not completed" });
    } catch (error) {
        console.error("Error verifying payment:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const getUserOrderById = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            userId,
        })
            .populate("items.product")
            .populate("address");

        if (!order) {
            return res.json({ success: false, message: "Booking not found." });
        }

        return res.json({ success: true, order });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req;

        // Auto-sync any unpaid online bookings with recent Stripe checkouts
        const unpaidOnline = await Order.find({ userId, paymentType: "Online", isPaid: false });
        if (unpaidOnline.length > 0) {
            try {
                const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
                const sessions = await stripeInstance.checkout.sessions.list({ limit: 50 });
                for (const session of sessions.data) {
                    if (session.payment_status === "paid" && session.metadata?.orderId) {
                        const depositAmount = Number(session.metadata.depositAmount || 0);
                        await Order.findOneAndUpdate(
                            { _id: session.metadata.orderId, userId },
                            { isPaid: true, paidAmount: depositAmount }
                        );
                    }
                }
            } catch (stripeErr) {
                console.error("Stripe sync error in getUserOrders:", stripeErr.message);
            }
        }

        const orders = await Order.find({ userId })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders: orders });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.json({ success: false, message: error.message });
    }
}


export const getAllOrders = async (req, res) => {
    try {
        // Auto-sync any unpaid online bookings with recent Stripe checkouts
        const unpaidOnline = await Order.find({ paymentType: "Online", isPaid: false });
        if (unpaidOnline.length > 0) {
            try {
                const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
                const sessions = await stripeInstance.checkout.sessions.list({ limit: 50 });
                for (const session of sessions.data) {
                    if (session.payment_status === "paid" && session.metadata?.orderId) {
                        const depositAmount = Number(session.metadata.depositAmount || 0);
                        await Order.findByIdAndUpdate(session.metadata.orderId, {
                            isPaid: true,
                            paidAmount: depositAmount,
                        });
                    }
                }
            } catch (stripeErr) {
                console.error("Stripe sync error in getAllOrders:", stripeErr.message);
            }
        }

        // Sellers/admin should see all bookings/enquiries (paid or pending).
        const orders = await Order.find({})
            .populate("items.product")
            .populate("userId", "name email")
            .populate("address")
            .sort({ createdAt: -1 });
        return res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.json({ success: false, message: error.message });
    }
}

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const action = (req.body?.action || "").trim().toLowerCase();
        const reason = (req.body?.reason || "").trim();

        const order = await Order.findById(id).populate("userId", "name email");
        if (!order) {
            return res.json({ success: false, message: "Booking not found." });
        }

        // Allow toggling deposit payment status
        if (action === "mark_paid") {
            const depositAmount = order.paidAmount > 0 
                ? order.paidAmount 
                : Math.max(1, Math.round(order.amount * ((order.depositPercent || 10) / 100)));
            const updated = await Order.findByIdAndUpdate(
                id,
                { isPaid: true, paidAmount: depositAmount },
                { new: true }
            )
                .populate("items.product")
                .populate("userId", "name email");
            return res.json({ success: true, order: updated, message: "Deposit marked as Paid." });
        }

        if (action === "mark_pending") {
            const updated = await Order.findByIdAndUpdate(
                id,
                { isPaid: false, paidAmount: 0 },
                { new: true }
            )
                .populate("items.product")
                .populate("userId", "name email");
            return res.json({ success: true, order: updated, message: "Deposit marked as Pending." });
        }

        if (!["confirm", "reject"].includes(action)) {
            return res.json({ success: false, message: "Invalid action. Use confirm, reject, mark_paid, or mark_pending." });
        }

        if (action === "reject" && !reason) {
            return res.json({ success: false, message: "Rejection reason is required." });
        }

        if (order.bookingStatus === "confirmed" || order.bookingStatus === "rejected") {
            return res.json({
                success: false,
                message: `Booking already ${order.bookingStatus}.`,
            });
        }

        const update =
            action === "confirm"
                ? {
                      bookingStatus: "confirmed",
                      status: "confirmed",
                      rejectionReason: "",
                      statusUpdatedAt: new Date(),
                  }
                : {
                      bookingStatus: "rejected",
                      status: "rejected",
                      rejectionReason: reason,
                      statusUpdatedAt: new Date(),
                  };

        const updated = await Order.findByIdAndUpdate(id, update, { new: true })
            .populate("items.product")
            .populate("userId", "name email");

        if (order.userId?._id || order.userId) {
            const userId = order.userId._id || order.userId;
            if (action === "confirm") {
                await createNotification({
                    userId,
                    type: "booking_confirmed",
                    title: "Booking confirmed",
                    message:
                        "Your booking has been confirmed. You can download your receipt from booking details.",
                    refId: order._id,
                    refType: "order",
                    meta: { amount: order.amount, paidAmount: order.paidAmount },
                });
            } else {
                await createNotification({
                    userId,
                    type: "booking_rejected",
                    title: "Booking rejected",
                    message: reason,
                    refId: order._id,
                    refType: "order",
                    meta: { rejectionReason: reason, amount: order.amount },
                });
            }
        }

        return res.json({ success: true, order: updated });
    } catch (error) {
        console.error("Error updating booking status:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const getBookingReceipt = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;

        const order = await Order.findOne({ _id: id, userId })
            .populate("items.product")
            .populate("userId", "name email");

        if (!order) {
            return res.json({ success: false, message: "Booking not found." });
        }

        if (order.bookingStatus !== "confirmed") {
            return res.json({
                success: false,
                message: "Receipt is available only for confirmed bookings.",
            });
        }

        return res.json({ success: true, order });
    } catch (error) {
        console.error("Error fetching booking receipt:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {  
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event based on its type
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const { orderId, userId, depositAmount } = session.metadata || {};
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    isPaid: true,
                    paidAmount: Number(depositAmount || 0),
                });
            }
            if (userId) {
                await User.findByIdAndUpdate(userId, { cartItems: {} });
            }
            break;
        }
        case 'payment_intent.succeeded': {
            try {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });
                if (session?.data?.length > 0) {
                    const { orderId, userId, depositAmount } = session.data[0].metadata || {};
                    if (orderId) {
                        await Order.findByIdAndUpdate(orderId, {
                            isPaid: true,
                            paidAmount: Number(depositAmount || 0),
                        });
                    }
                    if (userId) {
                        await User.findByIdAndUpdate(userId, { cartItems: {} });
                    }
                }
            } catch (err) {
                console.error("Error processing payment_intent.succeeded:", err.message);
            }
            break;
        }
        case 'payment_intent.payment_failed': {
            try {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });
                if (session?.data?.length > 0) {
                    const { orderId } = session.data[0].metadata || {};
                    if (orderId) {
                        await Order.findByIdAndUpdate(orderId, { isPaid: false });
                    }
                }
            } catch (err) {
                console.error("Error processing payment_intent.payment_failed:", err.message);
            }
            break;
        }    
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
}