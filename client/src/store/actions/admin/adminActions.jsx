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
        if(response?.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const updateProduct = createAsyncThunk("admin/updateProduct", async (data, { dispatch }) => {
    try {
        console.log(data)
        const response = await axios.patch('/admin/product/update/main', data, { 
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const createProductVarient = createAsyncThunk("admin/createProductVarient", async (data, { dispatch }) => {
    try {
        const response = await axios.post('/admin/product/create/varient', data, { 
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const updateProductVarient = createAsyncThunk("admin/updateProductVarient", async (data, { dispatch }) => {
    try {
        const response = await axios.put('/admin/product/update/varient', data, { 
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})




export const deleteProduct = createAsyncThunk("admin/deleteProduct", async ({productId, varientId}, { dispatch }) => {
    try {
        const response = await axios.delete(`/admin/product/delete?pId=${productId}&vId=${varientId}`, { 
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const addNewCategory = createAsyncThunk("admin/addNewCategory", async (data, { dispatch }) => {
    try {
        const response = await axios.post(`/admin/category/create`, data, { 
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllCategories = createAsyncThunk("admin/getAllCategories", async () => {
    try {
        const response = await axios.get(`/admin/category/all`, { 
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})
export const addNewBrand = createAsyncThunk("admin/addNewBrand", async (data, { dispatch }) => {
    try {
        const response = await axios.post(`/admin/brand/create`, data, { 
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllBrands = createAsyncThunk("admin/getAllBrands", async () => {
    try {
        const response = await axios.get(`/admin/brand/all`, { 
            withCredentials: true 
        });
        if(response?.data?.status === "ok"){
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})