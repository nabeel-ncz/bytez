import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/userSlice";
import adminReducer from "./reducers/admin/adminSlice";
import productsReducer from "./reducers/products/productsSlice";

const store = configureStore({
    reducer:{
        user: userReducer,
        admin: adminReducer,
        products: productsReducer,
    }
});

export default store;