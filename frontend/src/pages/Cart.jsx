import  { useState, useEffect} from 'react';
import { useAppCOntext } from '../context/AppContext'
import {assets} from '../assets/assets';
import toast from 'react-hot-toast';
const Cart = () => {
    
    const { getCartCount, getTotalPrice, cartItems, removeFromCart, updateCardItems, products,currency, navigate,axios, user, setShowUserLogin } = useAppCOntext();

    const [cartArray, setCartArray] = useState([]);

    const getCart= () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            product.quantity = cartItems[key];
            tempArray.push(product);
        }
        setCartArray(tempArray);
    }

    const placeOrder =async () => {
        try {
            if (!user) {
                setShowUserLogin(true);
                return toast.error("Please login to book your order");
            }
            if (cartArray.length === 0) {
                return toast.error("Your cart is empty");
            }
            const { data } = await axios.post("/api/order/stripe", { 
                items: cartArray.map((item) => ({ product: item._id, quantity: item.quantity })),
             });
            if (data.success) {
                window.location.replace(data.url);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message); 
        }
    }

    useEffect(() => {
        if(products.length > 0 && cartItems){
            getCart();
        }
    }, [cartItems, products]);

    return products.length > 0 && cartItems ?(
        <div className="flex flex-col md:flex-row md:py-16 py-6 max-w-6xl w-full  mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-2xl md:text-3xl font-medium mb-6">
                    Cart / Booking <span className="text-sm text-indigo-500">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((cartItem, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {navigate(`/products/${cartItem.category.toLowerCase()}/${cartItem._id}`), scrollTo(0,0)}} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={cartItem.image[0]} alt={cartItem.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{cartItem.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{cartItem.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={(e) => updateCardItems(cartItem._id, Number(e.target.value))} value={cartItems[cartItem._id]} className='outline-none'>
                                            {Array(cartItems[cartItem._id]> 9 ? cartItems[cartItem._id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{cartItem.offerPrice * cartItem.quantity}</p>
                        <button onClick={() => removeFromCart(cartItem._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className='w-6 h-6 inline-block' />
                        </button>
                    </div>)
                )}

                <button onClick={() => {navigate("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
                    <img src={assets.arrow_right_icon_colored} alt="arrow" />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Booking Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Booking</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Pay <span className="font-semibold text-gray-700">10%</span> of the total amount now to confirm your booking. Our team will contact you for measurement, delivery, and the remaining payment.
                    </p>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getTotalPrice()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{(getTotalPrice() * 0.02).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>{currency}{(getTotalPrice() * 1.02).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between font-semibold text-indigo-600">
                        <span>Pay Now (10%):</span><span>{currency}{((getTotalPrice() * 1.02) * 0.10).toFixed(2)}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition">
                   Pay 10% Deposit & Book
                </button>
            </div>
        </div>
    ) : null
};

export default Cart;
