import Notification from "../models/Notification.js";

export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            userId,
            isRead: false,
        });

        return res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const getNotificationById = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;

        const notification = await Notification.findOne({ _id: id, userId });
        if (!notification) {
            return res.json({ success: false, message: "Notification not found." });
        }

        return res.json({ success: true, notification });
    } catch (error) {
        console.error("Error fetching notification:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.json({ success: false, message: "Notification not found." });
        }

        return res.json({ success: true, notification });
    } catch (error) {
        console.error("Error marking notification read:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const markAllNotificationsRead = async (req, res) => {
    try {
        const { userId } = req;
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        return res.json({ success: true });
    } catch (error) {
        console.error("Error marking all notifications read:", error.message);
        return res.json({ success: false, message: error.message });
    }
};
