import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppCOntext } from "../context/AppContext";

const Notifications = () => {
    const {
        user,
        notifications,
        fetchNotifications,
        markAllNotificationsRead,
        unreadCount,
        setShowUserLogin,
    } = useAppCOntext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate("/");
            return;
        }
        fetchNotifications();
    }, [user]);

    const typeLabel = (type) => {
        if (type === "enquiry_reply") return "Enquiry reply";
        if (type === "booking_confirmed") return "Booking confirmed";
        if (type === "booking_rejected") return "Booking rejected";
        return type;
    };

    return (
        <div className="my-10 max-w-3xl">
            <button
                type="button"
                onClick={() => navigate("/my-orders")}
                className="text-sm text-indigo-600 hover:underline mb-6"
            >
                ← Back to My Bookings
            </button>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-medium uppercase">All Replies & Updates</h2>
                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="w-16 h-1 bg-primary rounded-full mb-8"></div>

            {notifications.length === 0 ? (
                <p className="text-gray-500">No notifications yet.</p>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <button
                            key={n._id}
                            type="button"
                            onClick={() => navigate(`/notifications/${n._id}`)}
                            className={`w-full text-left border rounded-lg p-4 transition hover:border-indigo-400 hover:shadow-sm ${
                                n.isRead ? "border-gray-200" : "border-indigo-300 bg-indigo-50/30"
                            }`}
                        >
                            <div className="flex flex-wrap justify-between gap-2">
                                <p className="font-medium text-gray-900">{n.title}</p>
                                <span className="text-xs uppercase tracking-wide text-gray-500">
                                    {typeLabel(n.type)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2 whitespace-pre-line">
                                {n.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-indigo-600 mt-2">View full details →</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
