import * as Yup from "yup";
const Schema = Yup.object().shape({
    title: Yup.string().required("Product name is required")
        .min(4, "Name is too short - should be 4 chars minimum"),
    category: Yup.string().required('Category is required'),
    brand: Yup.string().required('Brand is required'),
});
export default Schema;