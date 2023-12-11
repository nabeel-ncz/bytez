import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, register, verifyEmail, sendOtp, logout, login, getAllCartProducts, changeCartProductQuantity, deleteProductFromCart, getAllAddresses, getAllOrders, getAllUserTransactions, getAllWishlistItems } from "../../actions/user/userActions";

const INITIAL_STATE = {
    user:{
        loading:false,
        data: null,
        error: null,
    },
    cart: {
        loading: false,
        data: null,
        error: null,
    },
    addresses:{
        loading: false,
        data: null,
        error: null,
    },
    orders: {
        loading: false,
        data: null,
        totalCount: 0,
        error: null,
    },
    transactions: {
        loading: false,
        data: null,
        error: null,
    },
    wishlist: {
        loading: false,
        data: null,
        error: null,
    }
};
const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers:{
        resetError : (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        //signup user
        .addCase(register.pending, (state, action) => {
            state.user.loading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.user.loading = false;
            state.user.data = action.payload;
            state.user.error = null;
        })
        .addCase(register.rejected, (state, action) => {
            state.user.loading = false;
            state.user.error = action.error.message;
            state.user.data = null;
        })
        //email verification
        .addCase(verifyEmail.pending, (state) => {
            state.user.loading = true;
        })
        .addCase(verifyEmail.fulfilled, (state, action) => {
            state.user.loading = false;
            state.user.verified = true;
            state.user.error = null;
        })
        .addCase(verifyEmail.rejected, (state, action) => {
            state.user.loading = false;
            state.user.verified = false;
            state.user.error = action.error.message;
        })
        //login user
        .addCase(login.pending, (state) => {
            state.user.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.user.loading = false;
            state.user.data = action.payload;
            state.user.error = null;
        })
        .addCase(login.rejected, (state, action) => {
            state.user.loading = false;
            state.user.data = null;
            state.user.error = action.error.message;
        })
        //fetch user
        .addCase(fetchUser.pending, (state) => {
            state.user.loading = true;
            state.user.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.user.loading = false;
            state.user.data = action.payload.data;
            state.user.error = null;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.user.loading = false;
            state.user.data = null;
            // state.user.error = action.error.message;
        })
        //resend otp
        .addCase(sendOtp.pending, (state) => {
            state.user.loading = true;
            state.user.error = null;
        })
        .addCase(sendOtp.rejected, (state, action) => {
            state.user.loading = null;
            state.user.error = action.error.message;
        })
        //logout user
        .addCase(logout.pending, (state) => {
            state.user.loading = true;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.user.loading = false;
            state.user.error = null;;
            state.user.data = null;
        })
        .addCase(logout.rejected, (state, action) => {
            state.user.loading = false;
            state.user.error = action.error.message;
        })

        .addCase(getAllCartProducts.pending, (state) => {
            state.cart.loading = true;
        })
        .addCase(getAllCartProducts.fulfilled, (state, action) => {
            state.cart.loading = false;
            state.cart.error = null;
            state.cart.data = action?.payload;
        })
        
        .addCase(getAllCartProducts.rejected, (state, action) => {
            state.cart.loading = false;
            state.cart.error = action.error?.message;
            state.cart.data = null;
        })

        .addCase(changeCartProductQuantity.pending, (state) => {
            state.cart.loading = true;
        })
        .addCase(changeCartProductQuantity.fulfilled, (state, action) => {
            state.cart.loading = false;
            state.cart.error = null;
        })
        .addCase(changeCartProductQuantity.rejected, (state, action) => {
            state.cart.loading = false;
            state.cart.error = action?.error?.message;
        })

        .addCase(deleteProductFromCart.pending, (state) => {
            state.cart.loading = true;
        })
        .addCase(deleteProductFromCart.fulfilled, (state, action) => {
            state.cart.loading = false;
            state.cart.error = null;
        })
        .addCase(deleteProductFromCart.rejected, (state, action) => {
            state.cart.loading = false;
            state.cart.error = action?.error?.message;
        })

        .addCase(getAllAddresses.pending, (state) => {

        })
        .addCase(getAllAddresses.fulfilled, (state, action) => {
            state.addresses.loading = false;
            state.addresses.data = action.payload?.data;
        })
        //
        .addCase(getAllOrders.pending, (state) => {
            state.orders.loading = true;
        })
        .addCase(getAllOrders.fulfilled, (state, action) => {
            state.orders.data = action?.payload?.data?.orders;
            state.orders.totalCount = action?.payload?.data?.totalCount;
            state.orders.loading = false;
        })
        .addCase(getAllOrders.rejected, (state, action) => {
            state.orders.loading = false;
        })

        //
        .addCase(getAllUserTransactions.pending, (state) => {

        })
        .addCase(getAllUserTransactions.fulfilled, (state, action) => {
            state.transactions.data = action?.payload?.data?.transactions;
        })
        //
        .addCase(getAllWishlistItems.pending, (state) => {
            state.wishlist.loading = true;
        })
        .addCase(getAllWishlistItems.fulfilled, (state, action) => {
            state.wishlist.loading = false;
            state.wishlist.data = action?.payload?.data?.items;
        })
        .addCase(getAllWishlistItems.rejected, (state, action) => {
            state.wishlist.loading = false;
        })
    }    
});
export const { resetError } = userSlice.actions;
export default userSlice.reducer;