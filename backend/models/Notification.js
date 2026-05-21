import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["enquiry_reply", "booking_confirmed", "booking_rejected"],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        refId: { type: mongoose.Schema.Types.ObjectId, required: true },
        refType: {
            type: String,
            enum: ["enquiry", "order"],
            required: true,
        },
        isRead: { type: Boolean, default: false },
        meta: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

const Notification =
    mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema);

export default Notification;
