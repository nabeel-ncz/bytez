import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

export const register = createAsyncThunk("user/register", async ({ userCredentials }, { dispatch }) => {
    try {
        const response = await axios.post("/user/auth/signup", userCredentials, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        if (response.data.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error.message);
    }
})

export const login = createAsyncThunk("user/login", async ({userCredentials}, {dispatch}) => {
    try {
        const response = await axios.post("/user/auth/login", userCredentials, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        if (response.data.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error.message);
    }
})

export const verifyEmail = createAsyncThunk("user/verifyEmail", async ({ data }, { dispatch }) => {
    try {
        const response = await axios.post("/user/auth/verify/email", data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        console.log(response);
        if (response.data.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error.message);
    }
})

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    try {
        const response = await axios.get("/user/auth/isExist", { withCredentials: true });
        console.log(response)
        if (response.data.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error){
        throw new Error(error?.message);
    }
    
})

export const sendOtp = createAsyncThunk("user/sendOtp", async (email) => {
    try {
        const response = await axios.get(`/user/auth/send_otp?email=${email}`, {withCredentials:true});
        if(response.data.status === "error"){
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})


export const logout = createAsyncThunk("user/logout", async () => {
    try{
        const response = await axios.get("user/auth/logout", {withCredentials:true});
        if(response.data.status === "ok"){
            return response.data;
        }else {
            throw new Error(response.data?.message);
        }
    } catch (error){
        throw new Error(error?.message);
    }
})