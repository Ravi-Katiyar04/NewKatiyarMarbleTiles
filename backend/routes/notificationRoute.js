import express from "express";
import authUser from "../middlewares/authUser.js";
import {
    getUserNotifications,
    getNotificationById,
    markNotificationRead,
    markAllNotificationsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/user", authUser, getUserNotifications);
notificationRouter.put("/read-all", authUser, markAllNotificationsRead);
notificationRouter.get("/:id", authUser, getNotificationById);
notificationRouter.put("/:id/read", authUser, markNotificationRead);

export default notificationRouter;
