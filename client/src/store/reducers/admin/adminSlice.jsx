import { createSlice } from "@reduxjs/toolkit";
import { createProduct, deleteProduct, getAllAttribute, getAllBrands, getAllCarouselImages, getAllCategories, getAllCoupons, getAllNewsImages, getAllPosterImages, getAllProducts, getAllTransactions, getAllUsers } from "../../actions/admin/adminActions";
import { getAllOrders, updateOrderStatus } from "../../actions/admin/adminActions";

const INITIAL_STATE = {
    customers: {
        loading: false,
        data: null,
        error: null,
    },
    products: {
        loading: false,
        data: null,
        error: null,
    },
    productAttributes: {
        loading: false,
        data: null,
        error: null,
    },
    categories: {
        loading: false,
        data: null,
        error: null,
    },
    brands: {
        loading: false,
        data: null,
        error: null,
    },
    orders: {
        loading: false,
        data: null,
        error: null,
    },
    transactions: {
        loading: false,
        data: null,
        error: null,
    },
    coupons: {
        loading: false,
        data: null,
        error: null,
    },
    carousel: {
        loading: false,
        data: null,
        error: null,
    },
    poster: {
        loading: false,
        data: null,
        error: null,
    },
    news: {
        loading: false,
        data: null,
        error: null,
    }
}
const adminSlice = createSlice({
    name: "admin",
    initialState: INITIAL_STATE,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            //Get all the users
            .addCase(getAllUsers.pending, (state) => {
                state.customers.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.customers.loading = false;
                state.customers.data = action.payload?.users;
                state.customers.error = null;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.customers.loading = false;
                state.customers.data = null;
                state.customers.error = action?.error?.message;
            })
            //Create Product
            // .addCase(createProduct.pending, (state) => {
            //     state.products.loading = true;
            // })
            // .addCase(createProduct.fulfilled, (state, action) => {
            //     state.products.loading = false;
            //     state.products.error = null;
            // })
            // .addCase(createProduct.rejected, (state, action) => {
            //     state.products.loading = false;
            //     state.products.error = action?.error?.message;
            // })
            //get all products
            .addCase(getAllProducts.pending, (state) => {
                state.products.loading = true;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.products.loading = false;
                state.products.error = null;
                state.products.data = action.payload?.products;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.products.loading = false;
                state.products.data = null;
                state.products.error = action?.error?.message;
            })
            //get All Categories
            .addCase(getAllCategories.pending, (state) => {
                state.categories.loading = true;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.categories.loading = false;
                state.categories.data = action?.payload;
                state.categories.error = null;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.categories.loading = false;
                state.categories.error = action?.error?.message;
                state.categories.data = null;
            })

            //get All Categories
            .addCase(getAllBrands.pending, (state) => {
                state.brands.loading = true;
            })
            .addCase(getAllBrands.fulfilled, (state, action) => {
                state.brands.loading = false;
                state.brands.data = action?.payload;
                state.brands.error = null;
            })
            .addCase(getAllBrands.rejected, (state, action) => {
                state.brands.loading = false;
                state.brands.error = action?.error?.message;
                state.brands.data = null;
            })
            //
            .addCase(getAllAttribute.fulfilled, (state, action) => {
                state.productAttributes.data = action?.payload;
            })

            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.orders.data = action.payload?.orders;
            })

            .addCase(getAllTransactions.fulfilled, (state, action) => {
                state.transactions.data = action.payload?.transactions;
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.coupons.data = action.payload?.data;
            })

            .addCase(getAllCarouselImages.fulfilled, (state, action) => {
                state.carousel.data = action.payload?.data;
            })

            .addCase(getAllPosterImages.fulfilled, (state, action) => {
                state.poster.data = action.payload?.data;
            })
            
            .addCase(getAllNewsImages.fulfilled, (state, action) => {
                state.news.data = action.payload?.data;
            });
    }
})

export default adminSlice.reducer;