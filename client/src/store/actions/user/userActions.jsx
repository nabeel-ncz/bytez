import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../constants/urls";
import axios from "axios";
axios.defaults.baseURL = BASE_URL ? `${BASE_URL}/api` : "http://localhost:3000/api";

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

export const login = createAsyncThunk("user/login", async ({ userCredentials }, { dispatch }) => {
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

export const verifyEmail = createAsyncThunk("user/verifyEmail", async (data, { dispatch }) => {
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
    } catch (error) {
        throw new Error(error?.message);
    }

})

export const sendOtp = createAsyncThunk("user/sendOtp", async (email) => {
    try {
        const response = await axios.get(`/user/auth/send_otp?email=${email}`, { withCredentials: true });
        if (response.data.status === "error") {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})


export const logout = createAsyncThunk("user/logout", async () => {
    try {
        const response = await axios.get("user/auth/logout", { withCredentials: true });
        if (response.data.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const addProductToCart = createAsyncThunk("user/addProductToCart", async (data) => {
    try {
        const response = await axios.post(`user/cart/product/add`, {
            userId: data.userId,
            productId: data.productId,
            varientId: data.varientId,
        }, { withCredentials: true });
        if (response.data?.status === 'ok') {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllCartProducts = createAsyncThunk("user/getAllCartProducts", async (id) => {
    try {
        const response = await axios.get(`user/cart/product/all/${id}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data?.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const changeCartProductQuantity = createAsyncThunk("user/changeCartProductQuantity", async (data) => {
    try {
        const response = await axios.patch(`user/cart/product/change_quantity`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const deleteProductFromCart = createAsyncThunk("user/deleteProductFromCart", async (data) => {
    try {
        const response = await axios.put(`user/cart/product/delete?uId=${data.userId}&vId=${data.varientId}`, {}, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            return response.data;
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const createAddress = createAsyncThunk("user/createAddress", async (data) => {
    try {
        const response = await axios.post(`user/profile/address/create`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllAddresses = createAsyncThunk("user/getAllAddresses", async (userId) => {
    try {
        const response = await axios.get(`user/profile/address/all/${userId}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAddress = createAsyncThunk("user/getAddress", async ({ userId, addressId }) => {
    try {
        const response = await axios.get(`user/profile/address/find?uId=${userId}&aId=${addressId}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const updateAddress = createAsyncThunk("user/updateAddress", async (data) => {
    try {
        const response = await axios.patch(`user/profile/address/update`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const changeDefaultAddress = createAsyncThunk("user/changeDefaultAddress", async ({ userId, addressId }) => {
    try {
        const response = await axios.patch(`user/profile/address/default?uId=${userId}&aId=${addressId}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const deleteAddress = createAsyncThunk("user/deleteAddress", async ({ userId, addressId }) => {
    try {
        const response = await axios.patch(`user/profile/address/delete?uId=${userId}&aId=${addressId}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})
export const updateUserInform = createAsyncThunk("user/updateUserInform", async (data) => {
    try {
        const response = await axios.patch(`user/profile/account/update`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const updateUserPassword = createAsyncThunk("user/updateUserPassword", async (data) => {
    try {
        const response = await axios.patch(`user/profile/account/update_password`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const createOrder = createAsyncThunk("user/createOrder", async (data) => {
    try {
        const response = await axios.post(`user/order/create`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllOrders = createAsyncThunk("user/getAllOrders", async ({ id, page, limit }) => {
    try {
        const response = await axios.get(`user/order/all?userId=${id}&page=${page}&limit=${limit}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllUserTransactions = createAsyncThunk("user/getAllUserTransactions", async ({ id, page, limit }) => {
    try {
        const response = await axios.get(`user/transaction/all?id=${id}&page=${page}&limit=${limit}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const getAllWishlistItems = createAsyncThunk("user/getAllWishlistItems", async (userId) => {
    try {
        const response = await axios.get(`user/wishlist/all/${userId}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const AddItemToWishlist = createAsyncThunk("user/addItemToWishlist", async (data, { dispatch }) => {
    try {
        const response = await axios.post(`user/wishlist/add`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            await dispatch(getAllWishlistItems(data?.userId));
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const removeItemFromWishlist = createAsyncThunk("user/removeItemFromWishlist", async (data, { dispatch }) => {
    try {
        const response = await axios.patch(`user/wishlist/delete`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            await dispatch(getAllWishlistItems(data?.userId));
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
});

export const getWishlistItemsDetails = createAsyncThunk("user/getWishlistItemsDetails", async (userId) => {
    try {
        const response = await axios.get(`user/wishlist/details/${userId}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const applyCouponInCart = createAsyncThunk("user/applyCouponInCart", async (data) => {
    try {
        const response = await axios.post(`user/cart/apply_coupon`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response.data;
        } else {
            throw new Error(response.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const removeCouponFromCart = createAsyncThunk("user/removeCouponFromCart", async (data) => {
    try {
        const response = await axios.patch(`user/cart/remove_coupon`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})
export const validateCoupon = createAsyncThunk("user/validateCoupon", async ({ id, price, status }) => {
    try {
        if (status) {
            const response = await axios.get(`user/cart/validate_coupon?id=${id}&price=${price}`, { withCredentials: true });
            if (response.data?.status === "ok") {
                return response?.data;
            } else {
                throw new Error(response?.data?.message);
            }
        } else {
            return { status: 'ok' };
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const generateReferralCode = createAsyncThunk("user/generateReferralCode", async (id) => {
    try {
        const response = await axios.get(`user/referral_code/${id}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const addProductReview = createAsyncThunk("user/addProductReview", async (data) => {
    try {
        const response = await axios.post(`user/product/add_review`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const updateProductReview = createAsyncThunk("user/updateProductReview", async (data) => {
    try {
        const response = await axios.put(`user/product/update_review`, data, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const deleteProductReview = createAsyncThunk("user/deleteProductReview", async (id) => {
    try {
        const response = await axios.delete(`user/product/delete_review?id=${id}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getAllProductReviews = createAsyncThunk("user/getAllProductReviews", async (id) => {
    try {
        const response = await axios.get(`user/product/get_review?pId=${id}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const getReview = createAsyncThunk("user/getReview", async (id) => {
    try {
        const response = await axios.get(`user/product/review?id=${id}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})

export const checkUserCanAddReview = createAsyncThunk("user/checkUserCanAddReview", async ({ userId, productId }) => {
    try {
        const response = await axios.get(`user/product/review/check?pId=${productId}&uId=${userId}`, { withCredentials: true });
        if (response.data?.status === "ok") {
            return response?.data;
        } else {
            throw new Error(response?.data?.message);
        }
    } catch (error) {
        throw new Error(error?.message);
    }
})


