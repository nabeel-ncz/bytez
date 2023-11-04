import { createSlice } from "@reduxjs/toolkit";
import { getStoreProducts } from "../../actions/products/productsAction";

const INITIAL_STATE = {
    loading: false,
    data: null,
    error: null,
}
const productsSlice = createSlice({
    name:"products",
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder
        //get store products
        .addCase(getStoreProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(getStoreProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        })
        .addCase(getStoreProducts.rejected, (state, action) => {
            state.loading = false;
            state.data = null;
            state.error = null;
        })
    }
})

export default productsSlice.reducer;