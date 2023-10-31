import * as Yup from "yup";
const loginSchema = Yup.object().shape({
    email:Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required")
    .min(4, "Password is too short - should be 4 chars minimum"),
});
export default loginSchema;