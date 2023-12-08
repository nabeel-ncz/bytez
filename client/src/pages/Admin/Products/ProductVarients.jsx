import React, { useEffect, useState } from 'react'
import { Chip, Button } from '@material-tailwind/react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DeleteVerification from '../../../components/CustomDialog/deleteVerification';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, getAllBrands, getAllCategories } from '../../../store/actions/admin/adminActions';
import formValidateSchema from '../../../schema/admin/productMainField';
import { getProductInAdminApi } from '../../../services/api';
import { BASE_URL } from '../../../constants/urls';

function ProductVarients() {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState({ productId: "", varientId: "" })
    const [editProduct, setEditProduct] = useState(false);
    const [tags, setTags] = useState(null);
    const [tag, setTag] = useState("");
    const dispatch = useDispatch();

    const { id } = useParams();

    const categories = useSelector(state => state.admin?.categories?.data);
    const brands = useSelector(state => state.admin?.brands?.data);

    useEffect(() => {
        dispatch(getAllCategories());
    }, []);

    useEffect(() => {
        dispatch(getAllBrands());
    }, []);

    useEffect(() => {
        handleFetch();
    }, [])

    const handleFetch = () => {
        getProductInAdminApi(id).then((response) => {
            if (response.data?.status === "ok") {
                setProduct(response.data?.data);
                setTags(response.data?.data?.tags);
            } else {
                setProduct(null);
            }
        })
    }

    const handleOpen = (productId, varientId) => {
        setDeleteId(state => ({
            ...state,
            productId: productId,
            varientId: varientId,
        }));
        setDialogOpen(state => !state);
    };

    const handleAfterDeletion = (data) => {
        setProduct(data)
    }

    const handleAddTag = () => {
        setTags(state => [...state, tag]);
        setTag("");
    }
    const handleRemoveFromTags = (i) => {
        const filtered = tags.filter((item, index) => index !== i);
        setTags(filtered)
    }

    const handleFormSubmit = (data) => {
        console.log(data)
        const formData = {
            id,
            title: data.title,
            category: data.category,
            brand: data.brand,
            tags: tags,
        };
        dispatch(updateProduct(formData)).then((response) => {
            if (response?.payload?.status === "ok") {
                setEditProduct(false);
                handleFetch();
            }
        })
    }

    return (
        <>
            <DeleteVerification open={dialogOpen} handleOpen={handleOpen} deleteId={deleteId} handleAfterDeletion={handleAfterDeletion} />
            <div className="p-5 w-full overflow-y-auto">
                <div className='flex items-end justify-between mb-2'>

                    <div className='flex flex-col items-start justify-center gap-1'>
                        {!editProduct ? (
                            <>
                                <h1 className="font-bold text-2xl">Name : {product?.title}</h1>
                                <h1 className="font-normal text-sm">Category : {product?.category}</h1>
                                <h1 className="font-normal text-sm">Brand : {product?.brand}</h1>
                            </>
                        ) : (
                            <Formik
                                initialValues={{ title: product?.title, category: product?.category, brand: product?.brand }}
                                validationSchema={formValidateSchema}
                                onSubmit={handleFormSubmit}
                                enableReinitialize
                            >
                                <Form className=''>
                                    <div className='flex flex-col items-start justify-center '>
                                        <Field
                                            type="text" name="title" className="w-32 bg-blue-gray-100 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200 h-10"
                                        />
                                        <ErrorMessage name="title" component="div" className="text-red-500 text-xs text-start" />
                                        <Field
                                            name="category" id="categories" as="select"
                                            className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                        >
                                            {categories?.map(({ category, _id }) => (
                                                <option value={_id} >{category}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="category" component="div" className="text-red-500 text-xs text-start" />
                                        <Field
                                            name="brand" id="brands" as="select"
                                            className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                        >
                                            {brands?.map(({ brand, _id }) => (
                                                <option value={_id} >{brand}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="brand" component="div" className="text-red-500 text-xs text-start" />
                                        <div className="p-5 rounded-lg mb-5 text-start">
                                            <h1 className="font-bold mb-2">Product Tags</h1>
                                            <div className='flex items-start justify-between'>
                                                <div className='w-1/2 flex flex-col items-start justify-start px-4'>
                                                    {tags?.map((item, index) => (
                                                        <div className='flex items-center justify-start gap-2'>
                                                            <h2 className='text-sm font-semibold'>{index + 1}. {item}</h2>
                                                            <button onClick={() => { handleRemoveFromTags(index) }} className='p-2 border border-gray-600 rounded'><img src="/icons/bin.png" alt="" className='w-3' /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className='w-1/2 flex flex-col items-end justify-start gap-2'>
                                                    <input type="text" placeholder='Enter the tags' className='w-full flex items-center justify-center h-10 bg-white border border-gray-600 rounded-md py-2 px-3 text-sm outline-none' value={tag} onChange={(event) => {
                                                        setTag(event.target.value)
                                                    }} />
                                                    <Button variant='gradient' size='sm' onClick={handleAddTag} className='bg-black text-center px-4 py-2 rounded'>Add</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <Button type='submit' variant='outlined' size='sm'>Save Product</Button>
                                    </div>
                                </Form>
                            </Formik>
                        )}

                    </div>
                    <div className='flex flex-col items-center justify-center gap-2'>
                        {!editProduct && (<Button type='button' onClick={() => { setEditProduct(true) }} variant='outlined' size='sm'>Edit Product</Button>)}
                        <Button type='button' onClick={() => { navigate(`/admin/products/create/varient/${id}`) }} variant='gradient'>Add Varient</Button>
                    </div>

                </div>
                <div className="overflow-x-scroll lg:overflow-hidden bg-white rounded-lg">
                    <table className="w-full min-w-max table-auto ">
                        <thead className="font-normal">
                            <tr className="border-b border-gray-200">
                                <th className="font-semibold p-4 text-left border-r">Image</th>
                                <th className="font-semibold p-4 text-left border-r w-60">Description</th>
                                <th className="font-semibold p-4 text-left border-r">Quantity</th>
                                <th className="font-semibold p-4 text-left border-r">Sold</th>
                                <th className="font-semibold p-4 text-left border-r">Price</th>
                                <th className="font-semibold p-4 text-left border-r">Rating</th>
                                <th className="font-semibold p-4 text-left border-r">Status</th>
                                <th className="font-semibold p-4 text-left border-r">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product?.varients?.map((doc) => (
                                <tr key={doc?.varientId}
                                    onClick={() => { }} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}
                                >
                                    <td className="text-sm p-4 flex items-center gap-2 text-start border-r">
                                        <div className="w-10 h-10 overflow-clip flex justify-center items-center">
                                            {doc.images?.mainImage ? (
                                                <img
                                                    src={`${BASE_URL}/products/resized/${doc?.images?.mainImage}`}
                                                    alt="img"
                                                    className="object-contain w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-slate-300 rounded-md"></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-sm p-4 text-start border-r">
                                        {doc?.description}
                                    </td>
                                    <td className="text-sm p-4 text-start border-r">{doc?.stockQuantity}</td>
                                    <td className="text-sm p-4 text-start border-r">{doc?.sold}</td>
                                    <td className="text-sm p-4 text-start border-r">{doc?.price}</td>
                                    <td className="text-sm p-4 text-start border-r">{doc?.totalRating}</td>
                                    <td className="text-sm p-4 text-start border-r">
                                        {doc?.status === "publish" &&
                                            (<Chip variant="ghost" color={"green"} size="sm" value={"Publish"} className='text-center' />)
                                        }
                                        {doc?.status === "unpublish" &&
                                            (<Chip variant="ghost" color={"blue-gray"} size="sm" value={"Unpublish"} className='text-center' />)
                                        }

                                    </td>
                                    <td className="text-sm p-4 text-start border-r">
                                        <Button className='me-2' color='yellow' size='sm' variant='gradient' onClick={() => navigate(`/admin/products/varient?pId=${product?._id}&vId=${doc?.varientId}`)}>Edit</Button>
                                        {/* <Button color='red' size='sm' variant='gradient' onClick={() => handleOpen(product?._id, doc?.varientId)} >Delete</Button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >

        </>
    )
}

export default ProductVarients;