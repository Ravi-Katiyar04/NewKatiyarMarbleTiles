import React, { useEffect } from 'react'
import { useAppCOntext } from '../context/AppContext'
import { useLocation } from 'react-router-dom';
const Loading = () => {

    const { navigate, axios, setCartItems } = useAppCOntext();
    let { search } = useLocation();
    const query = new URLSearchParams(search);

    const nextUrl = query.get("next");
    const sessionId = query.get("session_id");

    useEffect(() => {
        let isMounted = true;

        const verifyAndRedirect = async () => {
            if (sessionId) {
                try {
                    const { data } = await axios.get(`/api/order/verify-stripe?sessionId=${sessionId}`);
                    if (data?.success && setCartItems) {
                        setCartItems({});
                    }
                } catch (error) {
                    console.error("Error verifying payment session:", error);
                }
            }

            if (nextUrl && isMounted) {
                setTimeout(() => {
                    navigate(`/${nextUrl}`);
                }, sessionId ? 1500 : 3000);
            }
        };

        verifyAndRedirect();

        return () => {
            isMounted = false;
        };
    }, [nextUrl, sessionId]);

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
        </div>
    )
}

export default Loading