
import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import {Toaster} from 'react-hot-toast'
import { useAppCOntext } from "./context/AppContext"
import Login from "./components/Login"
import EnquiryDrawer from "./components/EnquiryDrawer"
import AllProduct from "./pages/AllProduct"
import ProductCategory from "./pages/ProductCategory"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import AddAddress from "./pages/AddAddress"
import MyOrder from "./pages/MyOrder"
import BookingDetail from "./pages/BookingDetail"
import EnquiryDetail from "./pages/EnquiryDetail"
import Notifications from "./pages/Notifications"
import NotificationDetail from "./pages/NotificationDetail"
import Contact from "./pages/Contact"
import About from "./pages/About"
import Blog from "./pages/Blog"
import Applications from "./pages/Applications"
import ApplicationDetails from "./pages/ApplicationDetails"
import SellerLogin from "./components/seller/SellerLogin"
import SellerLayout from "./pages/seller/SellerLayout"
import AddProduct from "./pages/seller/AddProduct"
import ProductList from "./pages/seller/ProductList"
import Orders from "./pages/seller/Orders"
import Loading from "./components/Loading"
const App = () => {

  const isSellerPath= useLocation().pathname.includes("seller");

  const {showUserLogin, isSellar} = useAppCOntext();

  return (
    <div className="text-default min-h-screen relative text-gray-700 bg-white">
      {isSellerPath ? null : <Navbar/>} 

      {showUserLogin ? <Login/> : null}
      {isSellerPath ? null : <EnquiryDrawer/>}

      <Toaster/>
      
      <div className={`${isSellerPath ? "" : " px-4 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/collections" element={<AllProduct />} />
          <Route path="/collections/:category" element={<ProductCategory />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:slug" element={<ApplicationDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrder />} />
          <Route path="/my-orders/booking/:id" element={<BookingDetail />} />
          <Route path="/my-orders/enquiry/:id" element={<EnquiryDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:id" element={<NotificationDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/loader" element={<Loading />} />

          <Route path="/seller" element={isSellar  ? <SellerLayout /> : <SellerLogin />} >
            <Route index element={isSellar ? <AddProduct/> : null} />
            <Route path="product-list" element={<ProductList/>} />
            <Route path="orders" element={<Orders/>} />
          </Route>


        </Routes>
      </div>

      {isSellerPath ? null : <Footer/>} 
    </div>
  )
}

export default App
