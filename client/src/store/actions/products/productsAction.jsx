import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../constants/urls";
import axios from "axios";
axios.defaults.baseURL = BASE_URL ? `${BASE_URL}/api` : "http://localhost:3000/api";


export const getStoreProducts = createAsyncThunk("products/getStoreProducts", async (query) => {
    try {
        const response = await axios.get(`/products/store?search=${query?.search ? query.search : 'all'}&category=${query?.category ? query.category : 'all'}&brand=${query?.brand ? query.brand : 'all'}
        &availability=${query?.availability ? query.availability : 'all'}&priceFrom=${query?.priceFrom ? query.priceFrom : 0}&priceTo=${query?.priceTo ? query.priceTo : Number.MAX_SAFE_INTEGER}&rating=${query?.rating ? query.rating : 'all'}&page=${query?.page}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const getProductsByBrand = createAsyncThunk("products/getProductsByBrand", async (brand) => {
    try {
        const response = await axios.get(`/products/${brand}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})