import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppCOntext } from "../context/AppContext";
import { downloadBookingReceipt } from "../utils/downloadBookingReceipt";

const BookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currency, user, axios, setShowUserLogin } = useAppCOntext();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate("/");
            return;
        }

        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/order/user/${id}`);
                if (data.success) setOrder(data.order);
                else {
                    toast.error(data.message);
                    navigate("/my-orders");
                }
            } catch (error) {
                toast.error(error.message);
                navigate("/my-orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user]);

    const handleDownloadReceipt = async () => {
        try {
            const { data } = await axios.get(`/api/order/${id}/receipt`);
            if (data.success) {
                downloadBookingReceipt(data.order, { currency, userName: user?.name });
                toast.success("Receipt downloaded.");
            } else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const statusLabel = (status) => {
        if (status === "confirmed") return { text: "Confirmed", className: "text-green-600 bg-green-50" };
        if (status === "rejected") return { text: "Rejected", className: "text-red-600 bg-red-50" };
        return { text: "Pending review", className: "text-amber-600 bg-amber-50" };
    };

    if (loading) return <p className="my-10 text-gray-500">Loading booking...</p>;
    if (!order) return null;

    const status = statusLabel(order.bookingStatus);

    return (
        <div className="my-10 max-w-3xl">
            <button
                type="button"
                onClick={() => navigate("/my-orders")}
                className="text-sm text-indigo-600 hover:underline mb-6"
            >
                ← Back to My Bookings
            </button>

            <h2 className="text-2xl font-medium uppercase">Booking Details</h2>
            <div className="w-16 h-1 bg-primary rounded-full mb-6"></div>

            <div className={`inline-block px-3 py-1 rounded text-sm font-medium mb-6 ${status.className}`}>
                {status.text}
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-8">
                <p>
                    <span className="font-medium text-gray-800">Booking ID:</span> {order._id}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Deposit:</span>{" "}
                    {order.isPaid ? `Paid (${currency}${order.paidAmount || 0})` : "Pending"}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Total amount:</span> {currency}
                    {order.amount}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Payment type:</span> {order.paymentType}
                </p>
            </div>

            {order.bookingStatus === "rejected" && order.rejectionReason && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <p className="font-medium">Rejection reason</p>
                    <p className="mt-1">{order.rejectionReason}</p>
                </div>
            )}

            <h3 className="font-medium text-gray-900 mb-4">Products</h3>
            <div className="space-y-4">
                {(order.items || []).map((item, index) => (
                    <div
                        key={index}
                        className="flex gap-4 border border-gray-200 rounded-lg p-4"
                    >
                        <img
                            src={item.product?.image?.[0]}
                            alt={item.product?.name}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                            <p className="font-medium">{item.product?.name || "Product"}</p>
                            <p className="text-sm text-gray-500">Category: {item.product?.category}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            <p className="text-indigo-600 font-medium mt-1">
                                {currency}
                                {(item.product?.offerPrice || 0) * item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {order.bookingStatus === "confirmed" && (
                <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="mt-8 px-6 py-3 bg-indigo-500 text-white font-medium rounded hover:bg-indigo-600 transition"
                >
                    Download booking receipt
                </button>
            )}
        </div>
    );
};

export default BookingDetail;
