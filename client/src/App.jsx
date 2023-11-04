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
import OrdersList from "./pages/Admin/Orders/OrdersList";
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


function App() {
  const user = useSelector(state => state.user?.user);
  const verified = useSelector(state => state.user?.user?.verified);
  const role = useSelector(state => state.user?.user?.role);

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
        <Route path="/page_not_found" element={<PageNotFound />} />
      
        {(role === "Admin" || role === "SuperAdmin") &&
          (<>
            <Route path="/admin/" element={<Layout role={"Admin"} />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/create" element={<AddProduct />} />
              <Route path="products/create/varient/:id" element={<AddVarient />} />
              <Route path="products/varient" element={<EditVarient />} />
              <Route path="products/view/:id" element={<ProductVarients />} />
              <Route path="payments" element={<Payments />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/create" element={<CreateCategory />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/create" element={<CreateBrand />} />
              <Route path="customers" element={<Customers />} />
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
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="verify/email" element={verified ? <>{console.log("working")}<Navigate to={"/"} /></> : <OtpValidation /> } />
            </Route>
            <Route path="*" element={<h2>ERROR</h2>} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App
