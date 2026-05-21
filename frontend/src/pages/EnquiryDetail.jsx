import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppCOntext } from "../context/AppContext";

const EnquiryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, axios, setShowUserLogin } = useAppCOntext();
    const [enquiry, setEnquiry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate("/");
            return;
        }

        const fetchEnquiry = async () => {
            try {
                const { data } = await axios.get(`/api/enquiry/user/${id}`);
                if (data.success) setEnquiry(data.enquiry);
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

        fetchEnquiry();
    }, [id, user]);

    if (loading) return <p className="my-10 text-gray-500">Loading query...</p>;
    if (!enquiry) return null;

    return (
        <div className="my-10 max-w-3xl">
            <button
                type="button"
                onClick={() => navigate("/my-orders")}
                className="text-sm text-indigo-600 hover:underline mb-6"
            >
                ← Back to My Bookings & Queries
            </button>

            <h2 className="text-2xl font-medium uppercase">Query Details</h2>
            <div className="w-16 h-1 bg-primary rounded-full mb-6"></div>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
                <p>
                    <span className="font-medium text-gray-800">Query ID:</span> {enquiry._id}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Date:</span>{" "}
                    {new Date(enquiry.createdAt).toLocaleString()}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Status:</span>{" "}
                    <span className="capitalize">{enquiry.status || "new"}</span>
                </p>
                <p>
                    <span className="font-medium text-gray-800">Name:</span> {enquiry.name}
                </p>
                <p>
                    <span className="font-medium text-gray-800">Phone:</span> {enquiry.phone}
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
                <p className="font-medium text-gray-900 mb-2">Your requirement</p>
                <p className="text-gray-700 whitespace-pre-line">{enquiry.requirement}</p>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-5">
                <p className="font-medium text-gray-900 mb-2">Team response</p>
                {enquiry.response?.message ? (
                    <>
                        <p className="text-gray-700 whitespace-pre-line">{enquiry.response.message}</p>
                        {enquiry.response.respondedAt && (
                            <p className="text-xs text-gray-500 mt-3">
                                Responded: {new Date(enquiry.response.respondedAt).toLocaleString()}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-gray-600">
                        Waiting for our team to reply. You will be notified when we respond.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EnquiryDetail;
