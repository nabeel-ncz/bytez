import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Button } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import CustomFileInput from '../../../components/CustomFileInput/CustomFileInput';
import { SwatchesPicker } from "react-color";
import CustomFileInputSmall from '../../../components/CustomFileInput/CustomFileInputSmall';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import productSchema from '../../../schema/admin/productSchema';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, getAllCategories, getAllBrands, createNewAttribute, getAllAttribute } from '../../../store/actions/admin/adminActions';

function AddProduct() {
    const [subImages, setSubImages] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
    const keysWithData = Object.keys(subImages).filter(key => subImages[key] !== null);
    const [mainImage, setMainImage] = useState(null);
    const [color, setColor] = useState(null);
    const [newRam, setNewRam] = useState("");
    const [newRom, setNewRom] = useState("")
    const [attributeError, setAttributeError] = useState(null);
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");

    const attributes = useSelector((state) => state?.admin?.productAttributes?.data);
    const categories = useSelector(state => state.admin?.categories?.data);
    const brands = useSelector(state => state.admin?.brands?.data);

    useEffect(() => {
        dispatch(getAllCategories());
        dispatch(getAllBrands());
        dispatch(getAllAttribute());
    }, []);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubImageChange = (file, imageName) => {
        setSubImages((state) => ({
            ...state,
            [imageName]: file,
        }));
    }
    const handleThumbnail = (file) => {
        setMainImage(file);
    }
    const handleColorPicker = (color, event) => {
        setColor(color.hex)
    }
    const handleAddTag = () => {
        setTags(state => [...state, tag]);
        setTag("");
    }
    const handleRemoveFromTags = (i) => {
        const filtered = tags.filter((item, index) => index !== i);
        setTags(filtered)
    }

    const handleAttributeSubmit = (event) => {
        event.preventDefault();
        if (newRam !== "" && newRom !== "" && newRam > 0 && newRom > 0) {
            dispatch(createNewAttribute({ ram: newRam, rom: newRom })).then(() => {
                dispatch(getAllAttribute());
                setNewRam("");
                setNewRom("");
                setAttributeError(null);
            })
        } else {
            setAttributeError("RAM and ROM should be greated that 0");
        }
    }

    const handleFormSubmit = (data) => {
        if (!mainImage || keysWithData.length < 2 || !color) {
            toast.error("Please correct the errors!");
        } else {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("stockQuantity", data.stockQuantity);
            formData.append("price", data.price);
            formData.append("discountPrice", data.discountPrice);
            formData.append("markup", data.markup);
            formData.append("category", data.category);
            formData.append("brand", data.brand);
            formData.append("status", data.status);
            formData.append("ramAndRom", data.ramAndRom);
            formData.append("color", color);
            formData.append("mainImage", mainImage);
            formData.append("tags", tags);

            let index = 1;
            Object.keys(subImages).forEach((key) => {
                const value = subImages[key];
                if (value !== null) {
                    formData.append(`subImage${index++}`, value);
                }
            })

            console.log(formData)
            dispatch(createProduct(formData)).then((result) => {
                toast.success('Product Created Successfully')
                navigate(`/admin/products/view/${result.payload?._id}`);
            }).catch(() => {
                toast.error("There is something went wrong!, Please try again later");
            })
        }
    }
    return (
        <>
            <div className="px-5 pt-2 w-full md:overflow-y-hidden">
                <Formik
                    initialValues={{
                        title: "", description: "", stockQuantity: "", price: "", discountPrice: "",
                        markup: "", category: "", brand: "", status: "", ramAndRom: ""
                    }}
                    validationSchema={productSchema}
                    onSubmit={handleFormSubmit}
                >
                    <Form className="">
                        <div className="flex justify-between items-center text-xs font-semibold">
                            <div>
                                <h1 className="font-bold text-2xl">Add Products</h1>
                                <Breadcrumbs>
                                    <Link to={"/admin"} className="opacity-60">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                    </Link>
                                    <Link to={"/admin/products"}>
                                        Products
                                    </Link>
                                    <Link to={"/admin/products/create"}>
                                        Add Product
                                    </Link>
                                </Breadcrumbs>
                            </div>
                            <div className="flex w-full justify-end gap-2 mb-2">
                                <Button variant='outlined' onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button type='submit' variant='gradient'>
                                    Save
                                </Button>
                            </div>
                        </div>
                        <div className='lg:flex'>
                            {/* Product Information */}
                            <div className="lg:w-4/6 lg:mr-5">
                                <div className="bg-white p-5 rounded-lg mb-5 lg:flex gap-5">
                                    <div className="lg:w-1/3 mb-3 lg:mb-0 text-start">
                                        <h1 className="font-bold mb-3">Product Thumbnail</h1>
                                        <CustomFileInput onChange={handleThumbnail} />
                                        {!mainImage && <h6 className="text-red-500 text-xs">Thumbnail is required</h6>}
                                    </div>
                                    <div className="lg:w-2/3 text-start">
                                        <h1 className="font-bold">Product Information</h1>
                                        <p className="text-sm mt-2 font-semibold">Title</p>
                                        <Field
                                            type="text" name="title"
                                            className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"

                                        />
                                        <ErrorMessage name="title" component="div" className="text-red-500 text-xs text-start" />

                                        <p className="text-sm mt-2 font-semibold">Description</p>
                                        <Field
                                            as="textarea" type="text" name="description"
                                            className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200 h-36"
                                        />
                                        <ErrorMessage name="description" component="div" className="text-red-500 text-xs text-start" />

                                        <p className="text-sm mt-2 font-semibold">Stock</p>
                                        <Field
                                            name="stockQuantity" type="number"
                                            className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                        />
                                        <ErrorMessage name="stockQuantity" component="div" className="text-red-500 text-xs text-start" />

                                    </div>
                                </div>
                                {/* Image Uploading */}
                                <div className="bg-white p-5 rounded-lg mb-5 flex flex-col items-start justify-center">
                                    <h1 className="font-bold">Product Images</h1>
                                    <div className='mt-4 flex items-center justify-center gap-4'>
                                        <CustomFileInputSmall handleChange={handleSubImageChange} imageName={1} />
                                        <CustomFileInputSmall handleChange={handleSubImageChange} imageName={2} />
                                        <CustomFileInputSmall handleChange={handleSubImageChange} imageName={3} />
                                    </div>
                                    <div className='mt-4 flex items-center justify-center gap-4'>
                                        <CustomFileInputSmall handleChange={handleSubImageChange} imageName={4} />
                                        <CustomFileInputSmall handleChange={handleSubImageChange} imageName={5} />
                                        <CustomFileInputSmall handleChange={handleSubImageChange} imageName={6} />
                                    </div>
                                    {keysWithData.length < 2 && <h6 className="text-red-500 text-xs">Atleast 2 sub images is required</h6>}
                                </div>
                                <div className="bg-white p-5 rounded-lg mb-5 text-start">
                                    <h1 className="font-bold mb-2">Product Attributes</h1>
                                    <div className='flex items-start justify-between gap-4'>
                                        <div className='w-full flex flex-col items-start justify-center gap-2'>
                                            <h2 className='font-bold opacity-50'>Available Varients</h2>
                                            {!attributes && (<h2>No varients available, Add a new one!</h2>)}
                                            {attributes?.map(({ ram, rom }) => (
                                                <div className='flex items-center justify-center gap-2'>
                                                    <Field type="radio" name='ramAndRom' value={`${ram}GB RAM & ${rom}GB ROM`} />
                                                    <label htmlFor="">{`${ram}GB RAM & ${rom}GB ROM`}</label>
                                                </div>
                                            ))}
                                            <ErrorMessage name="ramAndRom" component="div" className="text-red-500 text-xs text-start" />
                                        </div>
                                        <div className='w-full flex flex-col items-start justify-center'>
                                            <div className='flex flex-col items-start justify-center gap-2' >
                                                <h2 className='font-bold opacity-50'>Add a new Varient</h2>
                                                {attributeError && (<h2 className='text-red-500 text-xs text-start'>{attributeError}</h2>)}
                                                <div className='flex items-center justify-center h-10 bg-blue-gray-50'>
                                                    <input placeholder='RAM' type='number' min={0} value={newRam} onChange={(evt) => setNewRam(evt.target.value)}
                                                        name="ram" className="w-full bg-transparent rounded-md py-2 px-3 text-sm outline-none border border-gray-200"
                                                    />
                                                    <span className='px-2 h-full flex items-center justify-center'>GB</span>
                                                </div>
                                                <div className='flex items-center justify-center h-10 bg-blue-gray-50'>
                                                    <input placeholder='ROM' type='number' min={0} value={newRom} onChange={(evt) => setNewRom(evt.target.value)}
                                                        name="rom" className="w-full bg-transparent rounded-md py-2 px-3 text-sm outline-none border border-gray-200"
                                                    />
                                                    <span className='px-2 h-full flex items-center justify-center'>GB</span>
                                                </div>
                                                <Button type='button' size='sm' variant='gradient' onClick={handleAttributeSubmit}>Save</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-5 rounded-lg mb-5 text-start">
                                    <h1 className="font-bold mb-2">Product Colours</h1>
                                    <div className='flex items-center justify-start gap-6'>
                                        <div className='flex flex-col items-start justify-center'>
                                            <p className="text-sm my-2 font-semibold">Color</p>
                                            <SwatchesPicker onChange={handleColorPicker} />
                                        </div>
                                        <div className="w-40 h-20 block border text-center border-gray-500" style={{ backgroundColor: color ? color : "#fff" }}>
                                            {!color && <h6 className="text-red-500 text-xs">Color is required</h6>}
                                        </div>
                                    </div>

                                </div>
                                <div className="bg-white p-5 rounded-lg mb-5 text-start">
                                    <h1 className="font-bold mb-2">Product Tags</h1>
                                    <div className='flex items-start justify-between bg-white'>
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
                            </div>
                            <div className="lg:w-2/6">
                                <div className="bg-white p-5 rounded-lg mb-5 text-start">
                                    <h1 className="font-bold">Product Pricing</h1>
                                    <p className="text-sm mt-2 font-semibold">Price</p>
                                    <Field
                                        type="number"
                                        name='price'
                                        className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                    />
                                    <ErrorMessage name="price" component="div" className="text-red-500 text-xs text-start" />

                                    <p className="text-sm mt-2 font-semibold">Discount Price</p>
                                    <Field
                                        type="number"
                                        name='discountPrice'
                                        className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                    />
                                    <ErrorMessage name="discountPrice" component="div" className="text-red-500 text-xs text-start" />

                                    <p className="text-sm mt-2 font-semibold">Markup</p>
                                    <Field
                                        type="number"
                                        name='markup'
                                        className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                    />
                                    <ErrorMessage name="markup" component="div" className="text-red-500 text-xs text-start" />


                                </div>
                                <div className="bg-white p-5 rounded-lg mb-5 text-start">
                                    <h1 className="font-bold">Category</h1>
                                    <p className="text-sm mt-2 font-semibold text-gray-700">Product Category</p>
                                    <Field
                                        name="category" id="categories" as="select" 
                                        className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                    >
                                        {categories?.map(({ category, _id }) => (
                                            <option value={_id} >{category}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-red-500 text-xs text-start" />

                                </div>
                                <div className="bg-white p-5 rounded-lg mb-5 text-start">
                                    <h1 className="font-bold">Brand</h1>
                                    <p className="text-sm mt-2 font-semibold text-gray-700">Product Brand</p>
                                    <Field
                                        name="brand" id="brands" as="select"
                                        className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"
                                    >
                                        {brands?.map(({ brand, _id }) => (
                                            <option value={_id} >{brand}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="brand" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                                <div className="bg-white p-5 rounded-lg mb-5 text-start">
                                    <h1 className="font-bold">Product Status</h1>
                                    <p className="text-sm mt-2 font-semibold text-gray-700">Status</p>
                                    <Field
                                        name="status" id="status" as="select"
                                        className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200"

                                    >
                                        <option value="publish">publish</option>
                                        <option value="unpublish">unpublish</option>
                                    </Field>
                                    <ErrorMessage name="status" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}

export default AddProduct