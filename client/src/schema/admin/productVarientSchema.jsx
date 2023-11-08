import * as Yup from "yup";
const productVarientSchema = Yup.object().shape({
    description: Yup.string().required("Product description is required")
        .min(20, "Description is too short - should be 20 chars minimum"),
    stockQuantity: Yup.number()
        .typeError('Stock must be a number')
        .required('Stock is required')
        .positive('Stock must be a positive number'),
    price: Yup.number()
        .typeError('Price must be a number')
        .required('Price is required')
        .positive('Price must be a positive number'),
    discountPrice: Yup.number()
        .typeError('Discount price must be a number')
        .required('Discount Price is required')
        .positive('Discount price must be a positive number'),
    markup: Yup.number()
        .typeError('Markup must be a number')
        .required('Markup is required')
        .positive('Markup must be a positive number'),
    status: Yup.string().required('Product status is required'),
    ramAndRom: Yup.string().required('RAM & ROM is required'),
});
export default productVarientSchema;