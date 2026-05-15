import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppCOntext } from "../../context/AppContext";
import  toast  from "react-hot-toast";

const Orders = () => {

    // const orders = [
    //     { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA" }, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022", isPaid: true },
    //     { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA" }, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022", isPaid: true },
    //     { id: 1, items: [{ product: { name: "Nike Air Max 270" }, quantity: 1 }], address: { firstName: "John", lastName: "Doe", street: "123 Main St", city: "New York", state: "NY", zipcode: "10001", country: "USA" }, amount: 320.0, paymentType: "Credit Card", orderDate: "10/10/2022", isPaid: true },
    // ];

    const [orders, setOrders] = useState([]);
    const [enquiries, setEnquiries] = useState([]);

    const { currency,axios } = useAppCOntext();

    const fetchOders = async () => {
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
                if (enquiriesRes.value.data?.success) setEnquiries(enquiriesRes.value.data.enquiries || []);
                else toast.error(enquiriesRes.value.data?.message || "Failed to load enquiries.");
            } else {
                // If seller isn't logged in yet, this can 401; don't blank the whole page.
                toast.error(enquiriesRes.reason?.message || "Failed to load enquiries.");
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchOders();
    }, []);

    return (
        <div className="no-scrollbar flex-1 md:px-14 overflow-y-scroll h-[calc(100vh-64px)]">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Bookings / Enquiries</h2>

                {orders.map((order, ind) => (
                    <div key={ind} className="flex flex-col md:flex-row md:items-center  gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 hover:border-gray-500 transition">
                        <div className="flex gap-5 mx-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                            <div>
                                {(order.items || []).map((item, index) => (
                                    <div key={index} className="flex flex-col">
                                        <p className="font-medium">
                                            {(item.product && typeof item.product === "object" ? item.product.name : null) || "Product"}{" "}
                                            <span className="text-primary">x {item.quantity}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-black/60">
                            <p className='text-black/80'>
                                {order.userId?.name || "Customer"}
                            </p>
                            <p>{order.userId?.email || "Email unavailable"}</p>
                            {order.address && typeof order.address === "object" ? (
                                <>
                                    <p>
                                        {`${order.address.street || ""}${order.address.city ? `, ${order.address.city}` : ""}`}
                                    </p>
                                    <p>Mobile No.: {order.address.phone || "-"}</p>
                                </>
                            ) : null}
                        </div>

                        <p className="font-medium text-lg my-auto text-black/70">{currency}{order.amount}</p>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Type: Booking</p>
                            <p>Date: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(order.createdAt))}</p>
                            <p>Deposit: {order.isPaid ? "Paid" : "Pending"}</p>
                        </div>
                    </div>
                ))}

                {enquiries.map((enq) => (
                    <div key={enq._id} className="flex flex-col md:flex-row md:items-center gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 hover:border-gray-500 transition">
                        <div className="flex gap-5 mx-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="enquiry" />
                            <div className="text-sm md:text-base">
                                <p className="font-medium text-black/80">{enq.name}</p>
                                <p className="text-black/60">Mobile No.: {enq.phone}</p>
                                <p className="text-black/60">Requirement: {enq.requirement}</p>
                            </div>
                        </div>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Type: Enquiry</p>
                            <p>Date: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(enq.createdAt))}</p>
                            <p>Status: {enq.status || "new"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders