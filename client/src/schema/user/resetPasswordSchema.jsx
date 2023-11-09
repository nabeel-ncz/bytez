import * as Yup from "yup";
const resetPasswordSchema = Yup.object().shape({
    current_password: Yup.string().required("Password is required"),
    new_password: Yup.string()
    .min(4, "Password is too short - should be 4 chars minimum").matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter').required("Password is required"),
    confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
export default resetPasswordSchema;