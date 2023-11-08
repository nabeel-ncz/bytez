import { createSlice } from "@reduxjs/toolkit";
import { createProduct, deleteProduct, getAllAttribute, getAllBrands, getAllCategories, getAllProducts, getAllUsers } from "../../actions/admin/adminActions";

const INITIAL_STATE = {
    customers:{
        loading: false,
        data: null,
        error: null,
    },
    products:{
        loading: false,
        data: null,
        error: null,
    },
    productAttributes:{
        loading: false,
        data: null,
        error: null,
    },
    categories:{
        loading: false,
        data: null,
        error: null,
    },
    brands:{
        loading: false,
        data: null,
        error: null,
    }
}
const adminSlice = createSlice({
    name:"admin",
    initialState: INITIAL_STATE,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        //Get all the users
        .addCase(getAllUsers.pending, (state) => {
            state.customers.loading = true;
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.customers.loading = false;
            state.customers.data = action.payload;
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
            state.products.data = action.payload;
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
        
    }
})

export default adminSlice.reducer;