import Notification from "../models/Notification.js";

export async function createNotification({
    userId,
    type,
    title,
    message,
    refId,
    refType,
    meta = {},
}) {
    if (!userId) return null;

    try {
        return await Notification.create({
            userId,
            type,
            title,
            message,
            refId,
            refType,
            meta,
        });
    } catch (error) {
        console.error("Error creating notification:", error.message);
        return null;
    }
}
