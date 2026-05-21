import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppCOntext } from "../context/AppContext";

const MyOrder = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [myEnquiries, setMyEnquiries] = useState([]);
    const { currency, user, axios, setShowUserLogin } = useAppCOntext();
    const navigate = useNavigate();

    const fetchMyData = async () => {
        try {
            const [ordersRes, enquiriesRes] = await Promise.allSettled([
                axios.get("/api/order/user"),
                axios.get("/api/enquiry/user"),
            ]);

            if (ordersRes.status === "fulfilled") {
                const data = ordersRes.value.data;
                if (data?.success) setMyOrders(data.orders || []);
                else toast.error(data?.message || "Failed to load your bookings.");
            }

            if (enquiriesRes.status === "fulfilled") {
                const data = enquiriesRes.value.data;
                if (data?.success) setMyEnquiries(data.enquiries || []);
                else toast.error(data?.message || "Failed to load your enquiries.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    console.log(myOrders);
    console.log(myEnquiries);

    const bookingStatusLabel = (status) => {
        if (status === "confirmed") return { text: "Confirmed", className: "text-green-600" };
        if (status === "rejected") return { text: "Rejected", className: "text-red-600" };
        return { text: "Pending review", className: "text-amber-600" };
    };

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate("/");
            return;
        }
        fetchMyData();
    }, [user]);

    const firstProductName = (order) =>
        order.items?.[0]?.product?.name || "Booking";

    return (
        <div className="my-10 max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-medium uppercase">My Bookings & Queries</h2>
            <div className="w-16 h-1 bg-primary rounded-full mb-4"></div>
            <p className="text-sm text-gray-500 mb-8">
                Tap any item to view full details. Past enquiry replies are in{" "}
                <button
                    type="button"
                    onClick={() => navigate("/notifications")}
                    className="text-indigo-600 hover:underline"
                >
                    Notifications
                </button>
                .
            </p>

            <h3 className="text-lg font-medium uppercase text-gray-800 mb-4">Bookings</h3>
            {myOrders.length === 0 ? (
                <p className="text-gray-500 mb-10">No bookings yet.</p>
            ) : (
                <div className="space-y-3 mb-12">
                    {myOrders.map((order) => {
                        const status = bookingStatusLabel(order.bookingStatus);
                        return (
                            <button
                                key={order._id}
                                type="button"
                                onClick={() => navigate(`/my-orders/booking/${order._id}`)}
                                className="w-full text-left border border-gray-300 rounded-lg p-4 hover:border-indigo-400 hover:shadow-sm transition"
                            >
                                <div className="flex flex-wrap justify-between gap-2">
                                    <p className="font-medium text-gray-900">{firstProductName(order)}</p>
                                    <span className={`text-sm font-medium ${status.className}`}>
                                        {status.text}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString()} · Deposit:{" "}
                                    {order.isPaid ? "Paid" : "Pending"} · {currency}
                                    {order.amount}
                                </p>
                                <p className="text-xs text-indigo-600 mt-2">View details →</p>
                            </button>
                        );
                    })}
                </div>
            )}

            <h3 className="text-lg font-medium uppercase text-gray-800 mb-4">Queries (Enquiries)</h3>
            {myEnquiries.length === 0 ? (
                <p className="text-gray-500">
                    No open queries. Answered queries appear under Notifications.
                </p>
            ) : (
                <div className="space-y-3">
                    {myEnquiries.map((enq) => (
                        <button
                            key={enq._id}
                            type="button"
                            onClick={() => navigate(`/my-orders/enquiry/${enq._id}`)}
                            className="w-full text-left border border-gray-300 rounded-lg p-4 hover:border-indigo-400 hover:shadow-sm transition"
                        >
                            <div className="flex flex-wrap justify-between gap-2">
                                <p className="font-medium text-gray-900 line-clamp-1">
                                    {enq.requirement}
                                </p>
                                <span className="text-sm text-gray-600 capitalize">
                                    {enq.status || "new"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(enq.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-indigo-600 mt-2">View details →</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrder;
