import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import stripe from "stripe";

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
            success_url: `${origin}/loader?next=my-orders`,
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

export const getUserOrders = async (req, res) => {
    try {
        
        const { userId } = req;
        // Users should see COD orders immediately, and online orders only after payment succeeds.
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        res.json({success: true, orders: orders});
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.json({success: false, message: error.message });
    }
}


export const getAllOrders = async (req, res) => {
    try {
        // Sellers/admin should see all bookings/enquiries (paid or pending).
        const orders = await Order.find({})
            .populate("items.product")
            .populate("userId", "name email")
            .populate("address")
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.json({ success: false, message: error.message });
    }
}

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
        case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session= await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId, userId, depositAmount} = session.data[0].metadata;

            await Order.findByIdAndUpdate(orderId, {
                isPaid: true,
                paidAmount: Number(depositAmount || 0),
            });

            await User.findByIdAndUpdate(userId, {cartItems: {}});

            break;
        }
         case 'payment_intent.payment_failed':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session= await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId} = session.data[0].metadata;

            await Order.findByIdAndUpdate(orderId);

            break;
         }    
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
}