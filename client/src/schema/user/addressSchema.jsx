import * as Yup from "yup";
const addressSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required!"),
    lastname: Yup.string().required("Last name is required!"),
    homeAddress: Yup.string().required("Home address is required!"),
    email: Yup.string(),
    companyName: Yup.string(),
    phone: Yup.string().required("Phone number is required!"),
    country: Yup.string().required("Country name is required!"),
    state: Yup.string().required("State name is required!"),
    city: Yup.string().required("City name is required!"),
    zipcode: Yup.string().required("Zip Code is required!"),
})
export default addressSchema;