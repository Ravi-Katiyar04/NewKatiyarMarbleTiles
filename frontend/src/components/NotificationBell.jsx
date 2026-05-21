import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppCOntext } from "../context/AppContext";

const BellIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M15 17H9c-2.2 0-4-1.3-4.4-3.3L4 10.5V8a8 8 0 1116 0v2.5l-.6 3.2C19 15.7 17.2 17 15 17z" />
        <path d="M10 20a2 2 0 104 0" />
    </svg>
);

const NotificationBell = () => {
    const {
        user,
        notifications,
        unreadCount,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
    } = useAppCOntext();

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    if (!user) return null;

    const handleOpen = () => {
        setOpen((v) => !v);
        if (!open) fetchNotifications();
    };

    const handleViewAll = () => {
        setOpen(false);
        navigate("/notifications");
    };

    const handleClick = async (n) => {
        if (!n.isRead) await markNotificationRead(n._id);
        setOpen(false);
        navigate(`/notifications/${n._id}`);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={handleOpen}
                className="relative h-10 w-10 grid place-items-center border border-gray-200 hover:border-gray-400 transition text-gray-700"
                aria-label="Notifications"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-[10px] text-white bg-red-600 min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 shadow-lg z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <button
                            type="button"
                            onClick={handleViewAll}
                            className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                        >
                            All replies
                        </button>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllNotificationsRead}
                                className="text-xs text-indigo-600 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-gray-500">No notifications yet.</p>
                    ) : (
                        <>
                            <ul>
                                {notifications.slice(0, 5).map((n) => (
                                    <li key={n._id}>
                                        <button
                                            type="button"
                                            onClick={() => handleClick(n)}
                                            className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                                                !n.isRead ? "bg-indigo-50/50" : ""
                                            }`}
                                        >
                                            <p className="text-sm font-medium text-gray-900">{n.title}</p>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 whitespace-pre-line">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {notifications.length > 5 && (
                                <button
                                    type="button"
                                    onClick={handleViewAll}
                                    className="w-full py-3 text-xs text-indigo-600 hover:bg-gray-50"
                                >
                                    View all {notifications.length} replies →
                                </button>
                            )}
                            {notifications.length <= 5 && notifications.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleViewAll}
                                    className="w-full py-3 text-xs text-indigo-600 hover:bg-gray-50 border-t border-gray-100"
                                >
                                    View all replies →
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
