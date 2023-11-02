import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/userSlice";
import adminReducer from "./reducers/admin/adminSlice";

const store = configureStore({
    reducer:{
        user: userReducer,
        admin: adminReducer,
    }
}); 

export default store;