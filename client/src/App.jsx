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
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={"/"} />} />
        
        {(role === "Admin" || role === "SuperAdmin") &&
          (<>
            <Route path="/admin/" element={<Layout role={"Admin"} />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="payments" element={<Payments />} />
              <Route path="categories" element={<Categories />} />
              <Route path="brands" element={<Brands />} />
              <Route path="customers" element={<Customers />} />
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
            <Route path="/" element={<Layout role={"User"} />}>
              <Route index element={<Home />} />
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
