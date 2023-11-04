import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";


export const getStoreProducts = createAsyncThunk("products/getStoreProducts", async () => {
    try{
        const response = await axios.get('/products/store', { withCredentials: true });
        if(response.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
}) ;