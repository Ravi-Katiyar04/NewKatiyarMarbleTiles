import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";


axios.defaults.withCredentials = true;

// Set the base URL for axios requests
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// Create a context for the app

// This context will be used to share state and functions across the application
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency= import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSellar, setIsSellar] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [products, setProducts] = useState([])

    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    // Function to fetch the current user and set it in state
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/users/is-authenticated");
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            console.error("Error fetching user authentication:", error.message);
        }
    }

    // Function to fetch the current seller and set it in state
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            if (data.success) {
                setIsSellar(true);
            }else{
                setIsSellar(false);
            }
        } catch (error) {
            setIsSellar(false);
            console.error("Error fetching seller authentication:", error.message);
        }
    }


    const getCartCount = () => {
        let count = 0;
        for (const items in cartItems) {
            count += cartItems[items];
        }
        return count;
    }

    const getTotalPrice = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            totalAmount += cartItems[items] * products.find((product) => product._id === items).offerPrice;
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const fetchNotifications = async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }
        try {
            const { data } = await axios.get("/api/notification/user");
            if (data.success) {
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error.message);
        }
    };

    const markNotificationRead = async (id) => {
        try {
            const { data } = await axios.put(`/api/notification/${id}/read`);
            if (data.success) fetchNotifications();
        } catch (error) {
            console.error("Error marking notification read:", error.message);
        }
    };

    const markAllNotificationsRead = async () => {
        try {
            const { data } = await axios.put("/api/notification/read-all");
            if (data.success) fetchNotifications();
        } catch (error) {
            console.error("Error marking all notifications read:", error.message);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }   
        } catch (error) {
            toast.error(error.message)
        }

    }

    const addToCard= (itemId) => {
        let cardData= structuredClone(cartItems);

        if(cardData[itemId]){
            cardData[itemId] +=1;
        }else{
            cardData[itemId]=1;
        }
        setCartItems(cardData);
        toast.success("added to cart");
    }

    const updateCardItems = (itemId, quantity) => {
        let cardData= structuredClone(cartItems);
        cardData[itemId] = quantity;
        setCartItems(cardData);
        toast.success("cart updated");
    }

    const removeFromCart = (itemId) => {
        let cardData= structuredClone(cartItems);

        if(cardData[itemId]){
            cardData[itemId] -=1;

            if(cardData[itemId]===0){
                delete cardData[itemId];
            }
        }
        toast.success("removed from cart");
        setCartItems(cardData);
        
    }

    useEffect(() => {
        fetchUser();
        fetchProducts();
        fetchSeller();
        
    }, [])

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
        setNotifications([]);
        setUnreadCount(0);
    }, [user]);

    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post("/api/cart/update", { cartItems });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        if(user){
            updateCart();
        }
    }, [cartItems])
    
    const value = {
        navigate,
        user,
        setUser,
        isSellar,
        setIsSellar,
        showUserLogin,
        setShowUserLogin,
        showEnquiry,
        setShowEnquiry,
        products,
        currency,
        addToCard,
        updateCardItems,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery, 
        getCartCount,
        getTotalPrice,
        axios,
        fetchProducts,
        setCartItems,
        notifications,
        unreadCount,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
    };

    return (
        <AppContext.Provider
            value={value}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppCOntext = () => {
    return useContext(AppContext);
};