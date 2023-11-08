import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, register, verifyEmail, sendOtp, logout, login, getAllCartProducts, changeCartProductQuantity, deleteProductFromCart } from "../../actions/user/userActions";

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
            state.cart.data = action.payload?.data;
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
            state.cart.data = action?.payload?.data;
            state.cart.error = null;
        })
        .addCase(deleteProductFromCart.rejected, (state, action) => {
            state.cart.loading = false;
            state.cart.data = null;
            state.cart.error = action?.error?.message;
        })
    }    
});
export const { resetError } = userSlice.actions;
export default userSlice.reducer;