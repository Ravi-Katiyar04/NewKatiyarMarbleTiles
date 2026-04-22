import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppCOntext } from "../context/AppContext";
const MyOrder = () => {

    const [myOrders, setMyOrders] = useState([]);
    const [myEnquiries, setMyEnquiries] = useState([]);
    const { currency, user, axios } = useAppCOntext();

    const fetchMyData = async () => {
        try {
            const [ordersRes, enquiriesRes] = await Promise.allSettled([
                axios.get("/api/order/user"),
                axios.get("/api/enquiry/user"),
            ]);

            if (ordersRes.status === "fulfilled") {
                const data = ordersRes.value.data;
                if (data?.success) setMyOrders(data.orders || []);
                else toast.error(data?.message || "Failed to load your orders.");
            } else {
                toast.error(ordersRes.reason?.message || "Failed to load your orders.");
            }

            if (enquiriesRes.status === "fulfilled") {
                const data = enquiriesRes.value.data;
                if (data?.success) setMyEnquiries(data.enquiries || []);
                else toast.error(data?.message || "Failed to load your enquiries.");
            } else {
                toast.error(enquiriesRes.reason?.message || "Failed to load your enquiries.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyData();
        }
    }, [user]);


    return (
        <div className="my-10">
            <h2 className='text-2xl lg:text-3xl font-medium  uppercase'>My Orders</h2>
            <div className='w-16 h-1 bg-primary rounded-full mb-10'></div>

            {myOrders.map((order, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-8 py-5 ">
                    <p className="flex justify-between md:items-center text-gray-400 mb-6 text-sm md:text-base">
                        <span className='font-medium'>OrderID: {order._id}</span>
                        <span className='font-medium '>Payment: {order.isPaid ? "Deposit Paid" : "Pending"}</span>
                        <span className='font-medium'>Total: {currency} {order.amount}</span>
                    </p>

                    {(order.items || []).map((item, index) => (
                        <div key={index} className="flex justify-between items-center my-3">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <div className="bg-blue-200/30 rounded-lg p-4">
                                    <img src={item.product?.image?.[0]} alt={item.product?.name || "Product"} className="w-16 h-16 object-cover" />
                                </div>
                                <div>
                                    <h2>{item.product?.name || "Product"}</h2>
                                    <p>Category: {item.product?.category || "-"}</p>

                                </div>
                            </div>

                            <div className="flex flex-col">
                                <p className="text-gray-400 text-sm">Quantity: {item.quantity || "1"}</p>
                                <p className={` ${order.status === "Delivered" ? "text-green-500" : "text-gray-400"}`} >Status: {order.status}</p>
                                <p className="text-gray-400 text-sm"> Date: {new Date(order.createdAt).toLocaleDateString() }</p>
                            </div>

                            <div className="text-primary font-medium text-lg">
                                <p>Amount: {currency} {(item.product?.offerPrice || 0) * (item.quantity || 0)}</p>
                            </div>
 
                        </div>
                    ))}
                </div>
            ))}

            <h2 className='text-2xl lg:text-3xl font-medium uppercase mt-14'>My Enquiries</h2>
            <div className='w-16 h-1 bg-primary rounded-full mb-10'></div>

            {myEnquiries.length === 0 ? (
                <p className="text-gray-500">No enquiries yet.</p>
            ) : (
                myEnquiries.map((enq) => (
                    <div key={enq._id} className="border border-gray-300 rounded-lg p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-gray-700">
                            <p className="font-medium">EnquiryID: {enq._id}</p>
                            <p className="text-sm text-gray-500">Date: {new Date(enq.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm">Status: <span className="font-medium">{enq.status || "new"}</span></p>
                        </div>

                        <div className="mt-3 text-gray-700">
                            <p><span className="font-medium">Requirement:</span> {enq.requirement}</p>
                        </div>

                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded p-3">
                            <p className="font-medium text-gray-800">Response</p>
                            {enq.response?.message ? (
                                <>
                                    <p className="text-gray-700 mt-1">{enq.response.message}</p>
                                    {enq.response.respondedAt ? (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Responded on: {new Date(enq.response.respondedAt).toLocaleDateString()}
                                        </p>
                                    ) : null}
                                </>
                            ) : (
                                <p className="text-gray-600 mt-1">No response yet.</p>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyOrder
