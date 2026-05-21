import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
           
    }],
    // Total order value (full amount, not just deposit)
    amount: {
        type: Number,
        required: true,
    },
    // Amount actually collected online (e.g. 10% booking deposit)
    paidAmount: {
        type: Number,
        default: 0,
    },
    depositPercent: {
        type: Number,
        default: 10,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    },        
    status: {
        type: String,
        default: "order placed",
    },
    bookingStatus: {
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
        default: "",
    },
    statusUpdatedAt: {
        type: Date,
        default: null,
    },
    paymentType: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;