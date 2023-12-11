import { BASE_URL } from "../constants/urls";
import axios from "axios";
axios.defaults.baseURL = BASE_URL ? `${BASE_URL}/api` : "http://localhost:3000/api";

export const getAvailableUserCouponsApi = (id) => {
    return axios.get(`/user/coupons/available/${id}`, { withCredentials: true });
};

export const getActiveBrandsApi = () => {
    return axios.get(`/user/brands/all/active`, { withCredentials: true });
};

export const verifyPaymentApi = (data) => {
    return axios.post(`/user/order/payment/verify`, data, { withCredentials: true })
};

export const createOrderApi = (data) => {
    return axios.post('/user/razorpay/create_order', data, { withCredentials: true });
};

export const getRazorpayKeyApi = () => {
    return axios.get('/user/razorpay/key', { withCredentials: true });
};

export const getAllUserOrdersApi = (id) => {
    return axios.get(`/user/order/find/${id}`, { withCredentials: true });
};

export const productColorChangeApi = (id, color) => {
    return axios.get(`/products/varient/available/color?pId=${id}&color=${encodeURIComponent(color)}`, { withCredentials: true });
};

export const productColorAndAttributeChangeApi = (id, attribute, color) => {
    return axios.get(`/products/varient/available/attribute?pId=${id}&rr=${encodeURIComponent(attribute)}&color=${encodeURIComponent(color)}`, { withCredentials: true });
};

export const productAvailableColorsApi = (id, color) => {
    return axios.get(`/products/varient/attribute/available?pId=${id}&color=${encodeURIComponent(color)}`, { withCredentials: true });
};

export const productAvailableAttributesApi = (id, attribute) => {
    return axios.get(`/products/varient/color/available?pId=${id}&rr=${encodeURIComponent(attribute)}`, { withCredentials: true })
};

export const productViewApi = (id) => {
    return axios.get(`/products/view/${id}`, { withCredentials: true });
};

export const getUserAddressApi = (userId, addressId) => {
    return axios.get(`/user/profile/address/find?uId=${userId}&aId=${addressId}`, { withCredentials: true })
};

export const getActiveCategoriesApi = () => {
    return axios.get('/user/categories/all/active', { withCredentials: true });
};

export const resetPasswordVerifyApi = (data) => {
    return axios.patch(`/user/auth/verify/reset_password`, data);
};

export const forgorPasswordMailSendApi = (email) => {
    return axios.get(`/user/auth/send_mail?email=${email}`)
};

export const getBrandsInAdminApi = (id) => {
    return axios.get(`/admin/brand/${id}`, { withCredentials: true })
};

export const updateBrandInAdminApi = (data) => {
    return axios.put(`/admin/brand/update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
    })
};

export const getCategoryInAdminApi = (id) => {
    return axios.get(`/admin/category/${id}`, { withCredentials: true });
};

export const updateCategoryInAdminApi = (data) => {
    return axios.put(`/admin/category/update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
    });
};

export const getCustomerDetailsApi = (id) => {
    return axios.get(`/admin/customer/${id}`, { withCredentials: true })
}

export const updateCustomerStatusApi = (id, status) => {
    return axios.patch(`/admin/customer/update/status?id=${id}&status=${!status}`, {}, { withCredentials: true });
};

export const getUserOrderInAdminApi = (id) => {
    return axios.get(`/user/order/find/${id}`, { withCredentials: true });
}

export const getProductInAdminApi = (id) => {
    return axios.get(`/admin/product/${id}`, { withCredentials: true });
}

export const getProductVarientInAdminApi = (productId, varientId) => {
    return axios.get(`/admin/product/varient?pId=${productId}&vId=${varientId}`, { withCredentials: true })
}

export const getSalesReportInAdminApi = (period) => {
    return axios.get(`/admin/dashboard/sales/${period}`, { withCredentials: true })
}

export const getSalesReportByBrandInAdminApi = (id) => {
    return axios.get(`/admin/dashboard/sales_by_brand/${id}`, { withCredentials: true })
}