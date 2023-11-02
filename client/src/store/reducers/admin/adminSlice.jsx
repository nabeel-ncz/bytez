import { createSlice } from "@reduxjs/toolkit";
import { createProduct, getAllProducts, getAllUsers } from "../../actions/admin/adminActions";

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
        // })
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
    }
})

export default adminSlice.reducer;