import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../constants/urls";
import axios from "axios";
axios.defaults.baseURL = BASE_URL ? `${BASE_URL}/api` : "http://localhost:3000/api";

export const getAllUsers = createAsyncThunk("admin/getAllUsers", async ({ page, limit }) => {
    try {
        const response = await axios.get(`/admin/customer/all?page=${page}&limit=${limit}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})


export const getAllProducts = createAsyncThunk("admin/getAllProducts", async ({ page, limit, search }) => {
    try {
        const response = await axios.get(`/admin/product/all?page=${page}&limit=${limit}&search=${search ? search : ""}`, { withCredentials: true });
        if (response.data?.status === "ok") {
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
        if (response?.data?.status === "ok") {
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
        if (response?.data?.status === "ok") {
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
        if (response?.data?.status === "ok") {
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
        if (response?.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})




export const deleteProduct = createAsyncThunk("admin/deleteProduct", async ({ productId, varientId }, { dispatch }) => {
    try {
        const response = await axios.delete(`/admin/product/delete?pId=${productId}&vId=${varientId}`, {
            withCredentials: true
        });
        if (response?.data?.status === "ok") {
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
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        if (response?.data?.status === "ok") {
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
        if (response?.data?.status === "ok") {
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
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        });
        if (response?.data?.status === "ok") {
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
        if (response?.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const createNewAttribute = createAsyncThunk("admin/createNewAttribute", async (data) => {
    try {
        const response = await axios.post(`/admin/attribute/create`, data, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const getAllAttribute = createAsyncThunk("admin/getAllAttribute", async () => {
    try {
        const response = await axios.get(`/admin/attribute/all`, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})
export const getAllOrders = createAsyncThunk("admin/getAllOrders", async ({ page, limit, filterBy, startDate, endDate }) => {
    try {
        const response = await axios.get(`/admin/order/all?page=${page}&limit=${limit}&filterBy=${filterBy ? filterBy : "all"}&startDate=${startDate}&endDate=${endDate}`, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})
export const updateOrderStatus = createAsyncThunk("admin/updateOrderStatus", async (data) => {
    try {
        const response = await axios.patch(`/admin/order/update/status?id=${data?.orderId}&status=${data?.status}`, {}, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})
export const getAllTransactions = createAsyncThunk("admin/getAllTransactions", async ({ page, limit }) => {
    try {
        const response = await axios.get(`/admin/transactions/all?page=${page}&limit=${limit}`, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const createCoupon = createAsyncThunk("admin/createCoupon", async (data, { dispatch }) => {
    try {
        const response = await axios.post(`/admin/coupons/create`, data, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const updateCoupon = createAsyncThunk("admin/updateCoupon", async (data) => {
    try {
        const response = await axios.patch('/admin/coupons/update', data, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    };
})

export const getAllCoupons = createAsyncThunk("admin/getAllCoupons", async (data) => {
    try {
        const response = await axios.get(`/admin/coupons/all`, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getCouponDetails = createAsyncThunk("admin/getCouponDetails", async (id) => {
    try {
        const response = await axios.get(`/admin/coupons/details/${id}`, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const createBanner = createAsyncThunk("admin/createBanner", async (data) => {
    try {
        const response = await axios.post(`/admin/banner/create`, data, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const updateBanner = createAsyncThunk("admin/createBanner", async (data) => {
    try {
        const response = await axios.patch(`/admin/banner/update`, data, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
        if (response?.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const getAllCarouselImages = createAsyncThunk("admin/getAllCarouselImages", async () => {
    try {
        const response = await axios.get('/admin/banner/carousel', { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllPosterImages = createAsyncThunk("admin/getAllPosterImages", async () => {
    try {
        const response = await axios.get('/admin/banner/poster', { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const getAllNewsImages = createAsyncThunk("admin/getAllNewsImages", async () => {
    try {
        const response = await axios.get('/admin/banner/news', { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const deleteBanner = createAsyncThunk("admin/deleteBanner", async (id) => {
    try {
        const response = await axios.delete(`/admin/banner/delete/${id}`, { withCredentials: true });
        if (response?.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})