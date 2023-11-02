import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

export const getAllUsers = createAsyncThunk("admin/getAllUsers", async () => {
    try{
        const response = await axios.get('/admin/customer/all', { withCredentials: true });
        if(response.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})


export const getAllProducts = createAsyncThunk("admin/getAllProducts", async () => {
    try{
        const response = await axios.get('/admin/product/all', { withCredentials: true });
        if(response.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const createProduct = createAsyncThunk("admin/createProduct", async (data, { dispatch }) => {
    try {
        const response = await axios.post('/admin/product/create', data, { 
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true 
        });
        console.log(response.data);
    } catch (error) {
        console.log(error)
    }
})