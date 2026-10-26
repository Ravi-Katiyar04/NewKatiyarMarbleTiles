import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppCOntext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [replyDrafts, setReplyDrafts] = useState({});
    const [submittingId, setSubmittingId] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const { currency, axios } = useAppCOntext();

    const fetchOrders = async () => {
        try {
            const [ordersRes, enquiriesRes] = await Promise.allSettled([
                axios.get("/api/order/seller"),
                axios.get("/api/enquiry/seller"),
            ]);

            if (ordersRes.status === "fulfilled") {
                if (ordersRes.value.data?.success) setOrders(ordersRes.value.data.orders || []);
                else toast.error(ordersRes.value.data?.message || "Failed to load bookings.");
            } else {
                toast.error(ordersRes.reason?.message || "Failed to load bookings.");
            }

            if (enquiriesRes.status === "fulfilled") {
                if (enquiriesRes.value.data?.success) {
                    const list = enquiriesRes.value.data.enquiries || [];
                    setEnquiries(list);
                    const drafts = {};
                    list.forEach((e) => {
                        drafts[e._id] = e.response?.message || "";
                    });
                    setReplyDrafts(drafts);
                } else {
                    toast.error(enquiriesRes.value.data?.message || "Failed to load enquiries.");
                }
            } else {
                toast.error(enquiriesRes.reason?.message || "Failed to load enquiries.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const respondToEnquiry = async (enquiryId) => {
        const message = (replyDrafts[enquiryId] || "").trim();
        if (!message) return toast.error("Please enter a reply.");

        setSubmittingId(enquiryId);
        try {
            const { data } = await axios.put(`/api/enquiry/${enquiryId}/respond`, {
                message,
                status: "responded",
            });
            if (data.success) {
                toast.success(data.message || "Reply sent. Enquiry removed.");
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmittingId(null);
        }
    };

    const updateBooking = async (orderId, action, reason = "") => {
        setSubmittingId(orderId);
        try {
            const { data } = await axios.put(`/api/order/${orderId}/status`, {
                action,
                reason,
            });
            if (data.success) {
                toast.success(action === "confirm" ? "Booking confirmed." : "Booking rejected.");
                setRejectModal(null);
                setRejectReason("");
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmittingId(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatDate = (d) =>
        new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }).format(new Date(d));

    return (
        <div className="no-scrollbar flex-1 md:px-14 overflow-y-scroll h-[calc(100vh-64px)]">
            <div className="md:p-10 p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Bookings / Enquiries</h2>
                    <button
                        type="button"
                        onClick={() => {
                            fetchOrders();
                            toast.success("Synced bookings & payments");
                        }}
                        className="px-3 py-1.5 text-xs font-medium border border-indigo-500 text-indigo-600 rounded hover:bg-indigo-50 transition cursor-pointer"
                    >
                        ↻ Sync Payments
                    </button>
                </div>

                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="flex flex-col gap-4 p-5 max-w-4xl rounded-md border border-gray-300 hover:border-gray-500 transition"
                    >
                        <div className="flex flex-col md:flex-row md:items-start gap-5 justify-between">
                            <div className="flex gap-5">
                                <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="booking" />
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-indigo-600 font-medium mb-1">
                                        Booking
                                    </p>
                                    {(order.items || []).map((item, index) => (
                                        <p key={index} className="font-medium text-black/80">
                                            {(item.product?.name || "Product")}{" "}
                                            <span className="text-primary">x {item.quantity}</span>
                                        </p>
                                    ))}
                                    <p className="text-sm text-black/60 mt-1">
                                        {order.userId?.name || "Customer"} · {order.userId?.email || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm text-black/60 space-y-1">
                                <p className="font-medium text-lg text-black/70">
                                    {currency}
                                    {order.amount}
                                </p>
                                <p>Date: {formatDate(order.createdAt)}</p>
                                <p>
                                    Deposit:{" "}
                                    <span className={`font-semibold ${order.isPaid ? "text-green-600" : "text-amber-600"}`}>
                                        {order.isPaid
                                            ? `Paid (${currency}${order.paidAmount || Math.round(order.amount * 0.1)})`
                                            : "Pending"}
                                    </span>
                                </p>
                                <p>
                                    Status:{" "}
                                    <span
                                        className={`font-medium capitalize ${
                                            order.bookingStatus === "confirmed"
                                                ? "text-green-600"
                                                : order.bookingStatus === "rejected"
                                                  ? "text-red-600"
                                                  : "text-amber-600"
                                        }`}
                                    >
                                        {order.bookingStatus || "pending"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-200">
                            <button
                                type="button"
                                disabled={submittingId === order._id}
                                onClick={() => updateBooking(order._id, order.isPaid ? "mark_pending" : "mark_paid")}
                                className={`px-3 py-1.5 text-xs font-medium rounded border transition cursor-pointer disabled:opacity-50 ${
                                    order.isPaid
                                        ? "border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100"
                                        : "border-green-600 text-green-700 bg-green-50 hover:bg-green-100"
                                }`}
                            >
                                {order.isPaid ? "Mark Deposit as Pending" : "✓ Mark Deposit as Paid"}
                            </button>

                            {order.bookingStatus === "pending" && (
                                <>
                                    <button
                                        type="button"
                                        disabled={submittingId === order._id}
                                        onClick={() => updateBooking(order._id, "confirm")}
                                        className="px-4 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                                    >
                                        Confirm booking
                                    </button>
                                    <button
                                        type="button"
                                        disabled={submittingId === order._id}
                                        onClick={() => setRejectModal(order._id)}
                                        className="px-4 py-1.5 border border-red-500 text-red-600 text-xs font-medium rounded hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                                    >
                                        Reject booking
                                    </button>
                                </>
                            )}
                        </div>

                        {order.bookingStatus === "rejected" && order.rejectionReason && (
                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                                <span className="font-medium">Rejection reason:</span> {order.rejectionReason}
                            </p>
                        )}
                    </div>
                ))}

                {enquiries.map((enq) => (
                    <div
                        key={enq._id}
                        className="flex flex-col gap-4 p-5 max-w-4xl rounded-md border border-gray-300 hover:border-gray-500 transition"
                    >
                        <div className="flex flex-col md:flex-row md:items-start gap-5 justify-between">
                            <div className="flex gap-5">
                                <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="enquiry" />
                                <div className="text-sm md:text-base">
                                    <p className="text-xs uppercase tracking-wider text-indigo-600 font-medium mb-1">
                                        Enquiry
                                    </p>
                                    <p className="font-medium text-black/80">{enq.name}</p>
                                    <p className="text-black/60">Mobile: {enq.phone}</p>
                                    <p className="text-black/60 mt-2">
                                        <span className="font-medium">Requirement:</span> {enq.requirement}
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm text-black/60">
                                <p>Date: {formatDate(enq.createdAt)}</p>
                                <p>Status: {enq.status || "new"}</p>
                                {enq.userId ? (
                                    <p className="text-xs text-green-700 mt-1">Linked to user account</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">Guest enquiry</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Your reply {enq.userId ? "(user will be notified)" : ""}
                            </label>
                            <textarea
                                value={replyDrafts[enq._id] ?? ""}
                                onChange={(e) =>
                                    setReplyDrafts((prev) => ({ ...prev, [enq._id]: e.target.value }))
                                }
                                rows={3}
                                placeholder="Type your answer to the customer..."
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                disabled={submittingId === enq._id}
                                onClick={() => respondToEnquiry(enq._id)}
                                className="mt-3 px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 disabled:opacity-50"
                            >
                                {submittingId === enq._id ? "Sending..." : "Send reply"}
                            </button>
                            {enq.response?.respondedAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Last replied: {new Date(enq.response.respondedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {rejectModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-medium text-gray-900">Reject booking</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Provide a reason. The customer will be notified.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                            placeholder="Reason for rejection..."
                            className="w-full mt-4 border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-red-400"
                        />
                        <div className="flex gap-3 mt-4 justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setRejectModal(null);
                                    setRejectReason("");
                                }}
                                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!rejectReason.trim() || submittingId === rejectModal}
                                onClick={() => updateBooking(rejectModal, "reject", rejectReason.trim())}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
