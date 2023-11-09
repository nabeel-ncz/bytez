import * as Yup from "yup";
const addressSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required!"),
    lastName: Yup.string().required("Last name is required!"),
    houseAddress: Yup.string().required("Home address is required!"),
    email: Yup.string(),
    companyName: Yup.string(),
    phone: Yup.number().required("Phone number is required!"),
    country: Yup.string().required("Country name is required!"),
    state: Yup.string().required("State name is required!"),
    city: Yup.string().required("City name is required!"),
    zipcode: Yup.string().required("Zip Code is required!"),
})
export default addressSchema;