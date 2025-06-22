import React, { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Auth/Login/Login"
import Signup from "./pages/Auth/Signup/Signup"
import { useDispatch, useSelector } from "react-redux"
import { fetchUser } from "./store/actions/user/userActions";
import Layout from "./pages/Layout/Layout";
import Home from "./pages/User/Home/Home";
import OtpValidation from "./pages/Auth/OtpValidation/OtpValidation";
import Dashboard from "./pages/Admin/Home/Dashboard"
import ProductsList from "./pages/Admin/Products/ProductsList";
import Payments from "./pages/Admin/Payments/Payments";
import Categories from "./pages/Admin/Categories/Categories";
import Brands from "./pages/Admin/Brands/Brands";
import Customers from "./pages/Admin/Customers/Customers";
import Admins from "./pages/Admin/Admins/Admins";
import Store from "./pages/User/Store/Store"
import Contact from "./pages/User/Contact/Contact"
import Cart from "./pages/User/Cart/Cart"
import Wishlist from "./pages/User/Wishlist/Wishlist"
import AddProduct from "./pages/Admin/Products/AddProduct"
import CustomerView from "./pages/Admin/Customers/CustomerView";
import { Toaster } from "react-hot-toast";
import ProductVarients from "./pages/Admin/Products/ProductVarients"
import AddVarient from "./pages/Admin/Products/AddVarient"
import EditVarient from "./pages/Admin/Products/EditProductVarient"
import Product from "./pages/User/Product/Product"
import BlockedUser from "./pages/User/Error/BlockedUser"
import PageNotFound from "./pages/Error/PageNotFound"
import CreateCategory from "./pages/Admin/Categories/CreateCategory"
import CreateBrand from "./pages/Admin/Brands/CreateBrand"
import NoAccount from "./pages/User/Error/NoAccount"
import Profile from "./pages/User/Profile/Profile"
import UserDashboard from "./pages/User/Profile/UserDashboard";
import AccountDetails from "./pages/User/Profile/AccountDetails"
import ShippingAddress from "./pages/User/Profile/ShippingAddress"
import Wallet from "./pages/User/Profile/Wallet"
import ChangePassword from "./pages/User/Profile/ChangePassword"
import CreateAddress from "./pages/User/Profile/CreateAddress"
import Checkout from "./pages/User/Order/Checkout"
import OrdersList from "./pages/User/Order/OrdersList"
import AdminOrdersList from "./pages/Admin/Orders/AdminOrdersList"
import OrderDetails from "./pages/User/Order/OrderDetails"
import AdminOrderDetails from "./pages/Admin/Orders/AdminOrderDetails"
import UpdateCategory from "./pages/Admin/Categories/UpdateCategory"
import UpdateBrand from "./pages/Admin/Brands/UpdateBrand"
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/Auth/ForgotPassword/ResetPassword"
import UpdateAddress from "./pages/User/Profile/UpdateAddress";
import Coupons from "./pages/Admin/Coupons/Coupons"
import CreateCoupon from "./pages/Admin/Coupons/CreateCoupon"
import UpdateCoupon from "./pages/Admin/Coupons/UpdateCoupon"
import Carousel from "./pages/Admin/Banners/Carousel"
import Banners from "./pages/Admin/Banners/Banners";
import Posters from "./pages/Admin/Banners/Posters";
import News from "./pages/Admin/Banners/News"
import UserCoupons from "./pages/User/Coupons/UserCoupons"


function App() {
  const user = useSelector(state => state.user?.user?.data);
  const verified = useSelector(state => state.user?.user?.data?.verified);
  const role = useSelector(state => state.user?.user?.data?.role);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={"/"} />} />
        <Route path="/auth/forgot_password" element={!user ? <ForgotPassword /> : <Navigate to={"/"} />} />
        <Route path="/auth/reset_password" element={!user ? <ResetPassword /> : <Navigate to={"/"} />} />
        <Route path="/page_not_found" element={<PageNotFound />} />
      
        {(role === "Admin" || role === "SuperAdmin") &&
          (<>
            <Route path="/admin/" element={<Layout role={"Admin"} />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<AdminOrdersList />} />
              <Route path="orders/view/:id" element={<AdminOrderDetails />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/create" element={<AddProduct />} />
              <Route path="products/create/varient/:id" element={<AddVarient />} />
              <Route path="products/varient" element={<EditVarient />} />
              <Route path="products/view/:id" element={<ProductVarients />} />
              <Route path="payments" element={<Payments />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/create" element={<CreateCategory />} />
              <Route path="categories/update/:id" element={<UpdateCategory />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/create" element={<CreateBrand />} />
              <Route path="brands/update/:id" element={<UpdateBrand />} />
              <Route path="banners" element={<Banners />} />
              <Route path="banners/carousel" element={<Carousel />} />
              <Route path="banners/poster" element={<Posters />} />
              <Route path="banners/news" element={<News />} />
              <Route path="customers" element={<Customers />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="coupons/create" element={<CreateCoupon />} />
              <Route path="coupons/update/:id" element={<UpdateCoupon />} />
              <Route path="customers/view/:id" element={<CustomerView />} />
              <Route path="admins" element={<Admins />} />
            </Route>
            <Route path="/admin/*" element={<h2>ERROR</h2>} />
            <Route path="*" element={<Navigate to={"/admin/"} />} />
          </>
          )
        }
        {((user && role) && (role === "Admin" || role === "SuperAdmin")) ? (
          <>
            <Route path="*" element={<Navigate to={"/admin/"} />} />
          </>
        ) : (
          <>
            <Route path="/" element={user?.isBlocked ? <BlockedUser /> : <Layout role={"User"} />}>
              <Route index element={<Home />} />
              <Route path="store" element={<Store />} />
              <Route path="product/:id" element={<Product />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={user ? <Profile /> : <NoAccount />} >
                <Route index element={<UserDashboard />} />
                <Route path="account" element={<AccountDetails />}/>
                <Route path="account/change_password" element={<ChangePassword />}/>
                <Route path="address" element={<ShippingAddress />}/>
                <Route path="address/create" element={<CreateAddress />}/>
                <Route path="address/update" element={<UpdateAddress />}/>
                <Route path="wallet" element={<Wallet />}/>
              </Route>
              <Route path="coupons" element={user ? <UserCoupons /> : <NoAccount />} />
              <Route path="cart" element={user ? <Cart /> : <NoAccount />} />
              <Route path="wishlist" element={user ? <Wishlist /> : <NoAccount />} />
              <Route path="checkout" element={user ? <Checkout /> : <NoAccount />} />
              <Route path="orders" element={user ? <OrdersList /> : <NoAccount />} />
              <Route path="orders/view/:id" element={user ? <OrderDetails /> : <NoAccount />} />
              <Route path="wishlist" element={user ? <Wishlist /> : <NoAccount/>} />
              <Route path="verify/email" element={verified ? <><Navigate to={"/"} /></> : <OtpValidation /> } />
            </Route>
            <Route path="*" element={<h2>ERROR</h2>} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App
