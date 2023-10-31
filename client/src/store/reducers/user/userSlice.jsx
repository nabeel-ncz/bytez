import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, register, verifyEmail, sendOtp, logout, login } from "../../actions/user/userActions";

const INITIAL_STATE = {
    loading:false,
    user:null,
    error:null
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
            state.loading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.user = null;
        })
        //email verification
        .addCase(verifyEmail.pending, (state) => {
            state.loading = true;
        })
        .addCase(verifyEmail.fulfilled, (state, action) => {
            state.loading = false;
            state.user.verified = true;
            state.error = null;
        })
        .addCase(verifyEmail.rejected, (state, action) => {
            state.loading = false;
            state.user.verified = false;
            state.error = action.error.message;
        })
        //login user
        .addCase(login.pending, (state) => {
            state.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.error = action.error.message;
        })
        //fetch user
        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
            state.error = null;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            // state.error = action.error.message;
        })
        //resend otp
        .addCase(sendOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(sendOtp.rejected, (state, action) => {
            state.loading = null;
            state.error = action.error.message;
        })
        //logout user
        .addCase(logout.pending, (state) => {
            state.loading = true;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;;
            state.user = null;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }    
});
export const { resetError } = userSlice.actions;
export default userSlice.reducer;