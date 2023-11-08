import React, { useEffect, useState } from 'react'
import ProductImageSlider from '../../../components/Slider/ProductImageSlider'
import { Chip, Rating, Button, IconButton } from '@material-tailwind/react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CardZoom from '../../../components/Cards/CardZoom';
import StarCardLarge from '../../../components/StarRating/StarCardLarge';
import ReviewCount from '../../../components/StarRating/ReviewCount';
import CardColourLarge from '../../../components/CardColour/CardColourLarge';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../../store/actions/user/userActions';

function Product() {
    const [product, setProduct] = useState(null);
    const [selectedVarient, setSelectedVarient] = useState(0);
    const [heroImage, setHeroImage] = useState(null);
    const [productImages, setProductImages] = useState(null);
    const [availableAttributes, setAvailableAttributes] = useState(null);
    const [availableColors, setAvailableColors] = useState(null);
    const user = useSelector(state => state.user?.user?.data);
    const dispatch = useDispatch();

    const { id } = useParams();
    useEffect(() => {
        handleFetch();
    }, []);

    
    const handleColorChange = (color) => {
        axios.get(`http://localhost:3000/products/varient/available/color?pId=${id}&color=${encodeURIComponent(color)}`,
        { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                setSelectedVarient(response?.data?.data?.varient);
                setProductVarientImages(response?.data?.data?.varient)
                getAvailableVarientColors(color)
            }
        })
    }
    const handleAttributeChange = (attribute, color) => {
        axios.get(`http://localhost:3000/products/varient/available/attribute?pId=${id}&rr=${encodeURIComponent(attribute)}&color=${encodeURIComponent(color)}`,
        { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                setSelectedVarient(response?.data?.data?.varient);
                setProductVarientImages(response?.data?.data?.varient)
            }
        })
    }
    
    const getAvailableVarientColors = (color) => {
        axios.get(`http://localhost:3000/products/varient/attribute/available?pId=${id}&color=${encodeURIComponent(color)}`,
            { withCredentials: true }).then((response) => {
                if (response.data?.status === "ok") {
                    setAvailableAttributes(response.data?.data);
                    getAvailableColorsOnTheAttribute(response.data?.data[0]);
                }
            })
    }
    const getAvailableColorsOnTheAttribute = (attribute) => {
        axios.get(`http://localhost:3000/products/varient/color/available?pId=${id}&rr=${encodeURIComponent(attribute)}`,
            { withCredentials: true }).then((response) => {
                if (response.data?.status === "ok") {
                    setAvailableColors(response.data?.data);
                }
            })
    }

    const handleFetch = () => {
        axios.get(`http://localhost:3000/products/view/${id}`, { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                console.log(response.data?.data)
                setProduct(response.data?.data);
                getAvailableVarientColors(response.data?.data?.varients[0]?.color);
                setHeroImage(response.data?.data?.varients[selectedVarient]?.images?.mainImage);
                setProductImages([
                    ...response.data?.data?.varients[selectedVarient]?.images?.subImages,
                    response.data?.data?.varients[selectedVarient]?.images?.mainImage
                ]);
            } else {
                setProduct(null);
            }
        })
    }

    const setProductVarientImages = (varient) => {
        setHeroImage(product?.varients[varient]?.images?.mainImage);
        setProductImages([
            ...product?.varients[varient]?.images?.subImages,
            product?.varients[varient]?.images?.mainImage
        ]);
    }

    const handleHeroImage = (image) => {
        setHeroImage(image)
    }

    const handleAddToCart = () => {
        if(!user){
            toast("Please create an account first!", { icon:"👤" });
        } else {
            dispatch(addProductToCart({
                userId: user?._id,
                productId: product?._id,
                varientId: product?.varients[selectedVarient]?.varientId,
            })).then((response) => {
                if(response.payload?.status === "ok"){
                    toast.success("Product added to cart successfully!");
                } else if(response.payload?.status === "error"){
                    toast.error(response.payload?.message);
                } else {
                    toast.error(response.error?.message);
                }
            })
        }
    }

    return (
        <>
            {product ? (
                <div className='w-full h-screen flex items-start justify-between pt-8 px-20'>
                    <div className='w-1/2 flex flex-col items-center justify-center gap-14'>
                        <CardZoom image={heroImage} />
                        <div className=''>
                            <ProductImageSlider handleHeroImage={handleHeroImage} images={product ? [...productImages] : []} />
                        </div>
                    </div>
                    <div className="lg:w-1/2 pt-12">
                        <div className='flex items-center justify-between w-10/12'>
                            <h1 className="text-3xl font-semibold text-start">{product?.title}</h1>
                            <IconButton variant="outlined" className='w-2/12'>
                                <img src="/icons/heart-icon.png" alt="" className='w-5 h-5' />
                            </IconButton>
                        </div>
                        <p className='text-start w-10/12 mt-2 opacity-50 line-clamp-2'>{product?.varients[selectedVarient]?.description}</p>
                        <div className='w-10/12 flex items-center justify-between border-t border-gray-400 mt-4 pt-4'>
                            <div className='flex flex-col items-start justify-center'>
                                <h1 className="text-blue-gray-900 text-2xl font-semibold me-2">
                                    ₹ {product?.varients[selectedVarient]?.discountPrice}
                                </h1>
                                <h1 className="text-gray-500 text-xl font-semibold line-through">
                                    ₹ {product?.varients[selectedVarient]?.price}
                                </h1>
                            </div>
                            <div className='flex items-start justify-center'>
                                <StarCardLarge />
                                <ReviewCount />
                            </div>
                        </div>
                        <div className='w-10/12 flex items-center justify-between border-t border-gray-400 mt-4 pt-4'>
                            <div className='flex flex-col items-start justify-center gap-2'>
                                <h2 className='opacity-50'>Choose a colour</h2>
                                <div className='flex items-center justify-center gap-2'>
                                    {availableColors?.map((value) => (
                                        <CardColourLarge status={value === product?.varients[selectedVarient]?.color} color={value} onColorClick={handleColorChange} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='w-10/12 flex items-center justify-between border-gray-600 mt-2'>
                            <div className='flex flex-col items-start justify-center gap-2'>
                                <h2 className='opacity-50'>Choose a variant</h2>
                                <div className='flex items-center justify-center gap-2'>
                                    {availableAttributes?.map((value) => (
                                        <div className={`bg-white px-2 py-1 border-2 border-black cursor-pointer ${product?.varients[selectedVarient]?.ramAndRom === value ? "opacity-100" : "opacity-50"}`} onClick={() => {handleAttributeChange(value, product?.varients[selectedVarient]?.color)}}>
                                            <h2 className='font-semibold'>{value}</h2>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-10/12 mt-4 pt-4">
                            <button className='w-1/3 bg-white flex items-center justify-center gap-4 border-[0.01rem] border-gray-800 rounded-full py-2'>
                                <img src="/icons/bell--yellow-icon.png" alt="" className='w-6' />
                                <span className='text-black font-semibold text-lg'>Notify Me</span>
                            </button>
                            <button className='w-2/3 bg-black flex items-center justify-center gap-4 rounded-full py-2' onClick={handleAddToCart}>
                                <img src="/icons/Frame-bag-icon.png" alt="" className='w-6' />
                                <span className='text-white font-semibold text-lg'>Add to cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) :
                (
                    <div className='w-screen h-screen flex items-center justify-center'>
                        <h1>Product Not Found!</h1>
                    </div>
                )}

        </>
    )
}

export default Product