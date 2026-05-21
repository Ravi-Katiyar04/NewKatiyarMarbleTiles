import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppCOntext } from "../context/AppContext";

const NotificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, axios, currency, setShowUserLogin, markNotificationRead } = useAppCOntext();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate("/");
            return;
        }

        const fetchNotification = async () => {
            try {
                const { data } = await axios.get(`/api/notification/${id}`);
                if (data.success) {
                    setNotification(data.notification);
                    if (!data.notification.isRead) {
                        await markNotificationRead(data.notification._id);
                    }
                } else {
                    toast.error(data.message);
                    navigate("/notifications");
                }
            } catch (error) {
                toast.error(error.message);
                navigate("/notifications");
            } finally {
                setLoading(false);
            }
        };

        fetchNotification();
    }, [id, user]);

    if (loading) return <p className="my-10 text-gray-500">Loading...</p>;
    if (!notification) return null;

    const meta = notification.meta || {};

    return (
        <div className="my-10 max-w-3xl">
            <button
                type="button"
                onClick={() => navigate("/notifications")}
                className="text-sm text-indigo-600 hover:underline mb-6"
            >
                ← Back to all replies
            </button>

            <h2 className="text-2xl font-medium">{notification.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
            </p>
            <div className="w-16 h-1 bg-primary rounded-full my-6"></div>

            {notification.type === "enquiry_reply" && (
                <div className="space-y-6">
                    {meta.requirement && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                            <p className="font-medium text-gray-900 mb-2">Your requirement</p>
                            <p className="text-gray-700 whitespace-pre-line">{meta.requirement}</p>
                        </div>
                    )}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
                        <p className="font-medium text-gray-900 mb-2">Our reply</p>
                        <p className="text-gray-700 whitespace-pre-line">
                            {meta.reply || notification.message}
                        </p>
                    </div>
                    {(meta.name || meta.phone) && (
                        <p className="text-sm text-gray-500">
                            Submitted as {meta.name}
                            {meta.phone ? ` · ${meta.phone}` : ""}
                        </p>
                    )}
                </div>
            )}

            {notification.type === "booking_confirmed" && (
                <div className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-line">{notification.message}</p>
                    {meta.amount != null && (
                        <p className="text-sm text-gray-600">
                            Booking total: {currency}{meta.amount}
                            {meta.paidAmount != null
                                ? ` · Deposit paid: ${currency}${meta.paidAmount}`
                                : ""}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={() => navigate(`/my-orders/booking/${notification.refId}`)}
                        className="px-5 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded hover:bg-indigo-600"
                    >
                        View booking & download receipt
                    </button>
                </div>
            )}

            {notification.type === "booking_rejected" && (
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                        <p className="font-medium text-red-800 mb-2">Rejection reason</p>
                        <p className="text-red-700 whitespace-pre-line">
                            {meta.rejectionReason || notification.message}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(`/my-orders/booking/${notification.refId}`)}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        View booking details →
                    </button>
                </div>
            )}

            {!["enquiry_reply", "booking_confirmed", "booking_rejected"].includes(
                notification.type
            ) && (
                <p className="text-gray-700 whitespace-pre-line">{notification.message}</p>
            )}
        </div>
    );
};

export default NotificationDetail;
