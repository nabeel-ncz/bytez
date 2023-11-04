import * as Yup from "yup";
const signupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required")
    .min(4, "Name is too short - should be 4 chars minimum"),
    email:Yup.string().email().required("Email is required"),
    password: Yup.string()
    .min(4, "Password is too short - should be 4 chars minimum").matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter').required("Password is required"),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
export default signupSchema;