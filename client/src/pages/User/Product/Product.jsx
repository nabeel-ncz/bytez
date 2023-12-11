import React, { useEffect, useState } from 'react'
import ProductImageSlider from '../../../components/Slider/ProductImageSlider'
import { Chip, Rating, Button, IconButton, Badge } from '@material-tailwind/react'
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CardZoom from '../../../components/Cards/CardZoom';
import StarCardLarge from '../../../components/StarRating/StarCardLarge';
import ReviewCount from '../../../components/StarRating/ReviewCount';
import CardColourLarge from '../../../components/CardColour/CardColourLarge';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, checkUserCanAddReview, deleteProductReview, fetchUser, getAllProductReviews } from '../../../store/actions/user/userActions';
import ReviewDigalog from '../../../components/CustomDialog/ReviewDialog';
import { productAvailableAttributesApi, productAvailableColorsApi, productColorAndAttributeChangeApi, productColorChangeApi, productViewApi } from '../../../services/api';
import PageLoading from '../../../components/Loading/PageLoading';

function Product() {
    const [product, setProduct] = useState(null);
    const [selectedVarient, setSelectedVarient] = useState(0);
    const [heroImage, setHeroImage] = useState(null);
    const [productImages, setProductImages] = useState(null);
    const [availableAttributes, setAvailableAttributes] = useState(null);
    const [availableColors, setAvailableColors] = useState(null);
    const [productReviews, setProductReviews] = useState([]);

    const user = useSelector(state => state.user?.user?.data);
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useSearchParams();
    const [addReviewDialog, setAddReviewDialog] = useState(false);
    const [userCanAddReview, setUserCanAddReview] = useState(false);
    const [changeReviewStatus, setChangeReviewStatus] = useState(false);
    const [currUserReview, setCurrUserReview] = useState(null);
    const [productLoading, setProductLoading] = useState(false);

    const { id } = useParams();
    useEffect(() => {
        setProductLoading(true);
        handleFetch();
    }, []);

    useEffect(() => {
        const showMessage = searchQuery.get('sv');
        if (showMessage) {
            toast("Please choose your varient", { icon: "👆" })
        }
    }, []);


    const handleColorChange = (color) => {
        productColorChangeApi(id, color).then((response) => {
            if (response.data?.status === "ok") {
                setSelectedVarient(response?.data?.data?.varient);
                setProductVarientImages(response?.data?.data?.varient)
                getAvailableVarientColors(color)
            }
        })
    }
    const handleAttributeChange = (attribute, color) => {
        productColorAndAttributeChangeApi(id, attribute, color).then((response) => {
            if (response.data?.status === "ok") {
                setSelectedVarient(response?.data?.data?.varient);
                setProductVarientImages(response?.data?.data?.varient)
            }
        })
    }

    const getAvailableVarientColors = (color) => {
        productAvailableColorsApi(id, color).then((response) => {
            if (response.data?.status === "ok") {
                setAvailableAttributes(response.data?.data);
                getAvailableColorsOnTheAttribute(response.data?.data[0]);
            }
        })
    }
    const getAvailableColorsOnTheAttribute = (attribute) => {
        productAvailableAttributesApi(id, attribute).then((response) => {
            if (response.data?.status === "ok") {
                setAvailableColors(response.data?.data);
            }
        })
    }

    const handleFetch = () => {
        productViewApi(id).then((response) => {
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
        }).finally(() => {
            setProductLoading(false);
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
        if (!user) {
            toast("Please create an account first!", { icon: "👤" });
        } else {
            dispatch(addProductToCart({
                userId: user?._id,
                productId: product?._id,
                varientId: product?.varients[selectedVarient]?.varientId,
            })).then((response) => {
                if (response.payload?.status === "ok") {
                    toast.success("Product added to cart successfully!");
                } else if (response.payload?.status === "error") {
                    toast.error(response.payload?.message);
                } else {
                    toast.error(response.error?.message);
                }
            })
        }
    }

    useEffect(() => {
        dispatch(getAllProductReviews(id)).then((response) => {
            if (response?.payload?.status === "ok") {
                setProductReviews(response?.payload?.data);
                const match = response?.payload?.data?.find((doc) => doc?.userId?._id === user?._id);
                if (match) {
                    setChangeReviewStatus(true);
                    setCurrUserReview(match._id);
                }
            }
        })
    }, [user, id, changeReviewStatus, currUserReview, addReviewDialog]);

    const handleDeleteReview = () => {
        dispatch(deleteProductReview(currUserReview)).then(() => {
            setChangeReviewStatus(false);
            setCurrUserReview(null);
        })
    }

    useEffect(() => {
        dispatch(checkUserCanAddReview({
            userId: user?._id,
            productId: id,
        })).then((response) => {
            if (response?.payload?.status === "ok") {
                setUserCanAddReview(response?.payload?.data?.user);
            }
        })
    }, [id, user]);

    return (
        <>
            {productLoading ? <PageLoading /> : (
                <>
                    {product ? (
                        <>
                            <div className='w-full flex flex-col lg:flex-row items-center justify-center lg:items-start lg:justify-between py-2 lg:pt-6 px-6 lg:px-20'>
                                <div className='w-full lg:w-1/2 mt-2 flex flex-col items-center justify-center gap-14 py-4 lg:py-12 bg-transparent mx-12 rounded-md shadow-sm'>
                                    <CardZoom image={heroImage} offer={100-Math.floor(((product?.varients[selectedVarient]?.discountPrice / product?.varients[selectedVarient]?.price) * 100))}/>
                                    <ProductImageSlider handleHeroImage={handleHeroImage} images={product ? [...productImages] : []} />
                                </div>
                                <div className="w-full lg:w-1/2 pt-12">
                                    <div className='flex items-center justify-between w-full lg:w-10/12'>
                                        <h1 className="text-3xl font-semibold text-start">{product?.title}</h1>
                                        {/* <IconButton variant="outlined" className='w-2/12'>
                                    <img src="/icons/heart-icon.png" alt="" className='w-5 h-5' />
                                </IconButton> */}
                                    </div>
                                    <p className='text-start w-full lg:w-10/12 mt-2 opacity-50 line-clamp-2'>{product?.varients[selectedVarient]?.description}</p>
                                    <div className='w-full lg:w-10/12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0 border-t border-gray-400 mt-4 pt-4'>
                                        <div className='flex flex-row lg:flex-col items-start justify-center'>
                                            <h1 className="text-blue-gray-900 text-2xl font-semibold me-2">
                                                ₹ {product?.varients[selectedVarient]?.discountPrice}
                                            </h1>
                                            <h1 className="text-gray-500 text-xl font-semibold line-through">
                                                ₹ {product?.varients[selectedVarient]?.price}
                                            </h1>
                                        </div>
                                        <div className='flex items-start justify-center lg:gap-0 gap-2'>
                                            {(product?.totalRating && product?.totalRating !== 0) && (
                                                <StarCardLarge value={product?.totalRating} />
                                            )}
                                            <ReviewCount value={productReviews?.length || 0} />
                                        </div>
                                    </div>
                                    <div className='w-full lg:w-10/12 flex items-center justify-between border-t border-gray-400 mt-4 pt-4'>
                                        <div className='flex flex-col items-start justify-center gap-2'>
                                            <h2 className='opacity-50'>Choose a colour</h2>
                                            <div className='flex items-center justify-center gap-2'>
                                                {availableColors?.map((value) => (
                                                    <CardColourLarge status={value === product?.varients[selectedVarient]?.color} color={value} onColorClick={handleColorChange} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full lg:w-10/12 flex items-center justify-between border-gray-600 mt-2'>
                                        <div className='flex flex-col items-start justify-center gap-2'>
                                            <h2 className='opacity-50'>Choose a variant</h2>
                                            <div className='flex items-center justify-center gap-2'>
                                                {availableAttributes?.map((value) => (
                                                    <div className={`bg-white px-2 py-1 border-2 border-black cursor-pointer ${product?.varients[selectedVarient]?.ramAndRom === value ? "opacity-100" : "opacity-50"}`} onClick={() => { handleAttributeChange(value, product?.varients[selectedVarient]?.color) }}>
                                                        <h2 className='font-semibold'>{value}</h2>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex lg:flex-row flex-col gap-3 w-full lg:w-10/12 mt-4 pt-4">
                                        {product?.varients[selectedVarient]?.status === "publish" ? (
                                            <>
                                                <button className='lg:w-1/3 w-full bg-white flex items-center justify-center gap-4 border-[0.01rem] border-gray-800 rounded-full py-2'>
                                                    <img src="/icons/bell--yellow-icon.png" alt="" className='w-6' />
                                                    <span className='text-black font-semibold text-lg'>Notify Me</span>
                                                </button>
                                                <button className='lg:w-2/3 w-full bg-black flex items-center justify-center gap-4 rounded-full py-2' onClick={handleAddToCart}>
                                                    <img src="/icons/Frame-bag-icon.png" alt="" className='w-6' />
                                                    <span className='text-white font-semibold text-lg'>Add to cart</span>
                                                </button>
                                            </>
                                        ) : (
                                            <h2 className='text-xs font-bold text-red-800'>This product is currently not available!</h2>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col items-start justify-center px-4 lg:px-20 pt-20'>
                                <div className='w-full flex items-center justify-between'>
                                    {productReviews?.length >= 1 && (
                                        <h2 className='font-bold text-xl underline py-4'>Reviews</h2>
                                    )}
                                    {(!changeReviewStatus && userCanAddReview) && (
                                        <Button size='sm' variant='outlined' onClick={() => {
                                            setAddReviewDialog(state => !state);
                                        }}>Add a review</Button>
                                    )}
                                </div>
                                <div className='w-full flex flex-col items-start gap-2'>
                                    {productReviews?.map((doc) => (
                                        <>
                                            {(changeReviewStatus && currUserReview === doc._id) && (
                                                <div className='w-full flex flex-col items-start gap-2 px-4 py-2 bg-gray-50 rounded-md'>
                                                    <div className='w-full flex items-center justify-between gap-4'>
                                                        <div className='flex gap-4'>
                                                            <div className='w-fit p-3 bg-gray-50 rounded-full overflow-hidden'>
                                                                <img src="/icons/user-gray.png" alt="" className='w-7' />
                                                            </div>
                                                            <div className='flex justify-start items-center gap-2'>
                                                                <h2 className='font-semibold text-lg'>{doc?.userId?.name}</h2>
                                                                <Chip
                                                                    variant="ghost"
                                                                    color={"green"}
                                                                    size="sm"
                                                                    value={"✓"}
                                                                    className='rounded-full w-5 h-5 p-1 flex items-center justify-center'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-2'>
                                                            <Button size='sm' variant='gradient' color='white' onClick={() => {
                                                                setAddReviewDialog(state => !state);
                                                            }}><img src="/icons/edit-icon.png" alt="" className='w-5' /></Button>
                                                            <Button size='sm' variant='gradient' color='white' onClick={handleDeleteReview}>
                                                                <img src="/icons/bin.png" alt="" className='w-5' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Rating value={doc.rating} readonly />
                                                    <p className='text-sm'>{doc.comment}</p>
                                                </div>
                                            )}
                                        </>
                                    ))}
                                    {productReviews?.map((doc) => (
                                        <>
                                            {changeReviewStatus ?
                                                currUserReview !== doc._id && (
                                                    <div className='w-full flex flex-col items-start gap-2 px-4 py-2 bg-gray-50 rounded-md'>
                                                        <div className='flex items-center justify-start gap-4'>
                                                            <div className='w-fit p-3 bg-gray-50 rounded-full overflow-hidden'>
                                                                <img src="/icons/user-gray.png" alt="" className='w-7' />
                                                            </div>
                                                            <div className='flex justify-start items-center gap-2'>
                                                                <h2 className='font-semibold text-lg'>{doc?.userId?.name}</h2>
                                                                <Chip
                                                                    variant="ghost"
                                                                    color={"green"}
                                                                    size="sm"
                                                                    value={"✓"}
                                                                    className='rounded-full w-5 h-5 p-1 flex items-center justify-center'
                                                                />
                                                            </div>
                                                        </div>
                                                        <Rating value={doc.rating} readonly />
                                                        <p className='text-sm'>{doc.comment}</p>
                                                    </div>
                                                )
                                                : (
                                                    <div className='w-full flex flex-col items-start gap-2 px-4 py-2 bg-gray-50 rounded-md'>
                                                        <div className='flex items-center justify-start gap-4'>
                                                            <div className='w-fit p-3 bg-gray-50 rounded-full overflow-hidden'>
                                                                <img src="/icons/user-gray.png" alt="" className='w-7' />
                                                            </div>
                                                            <div className='flex justify-start items-center gap-2'>
                                                                <h2 className='font-semibold text-lg'>{doc?.userId?.name}</h2>
                                                                <Chip
                                                                    variant="ghost"
                                                                    color={"green"}
                                                                    size="sm"
                                                                    value={"✓"}
                                                                    className='rounded-full w-5 h-5 p-1 flex items-center justify-center'
                                                                />
                                                            </div>
                                                        </div>
                                                        <Rating value={doc.rating} readonly />
                                                        <p className='text-sm'>{doc.comment}</p>
                                                    </div>
                                                )}
                                        </>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) :
                        (
                            <div className='w-screen h-screen flex items-center justify-center'>
                                <h1>Product Not Found!</h1>
                            </div>
                        )}
                </>)}
            <ReviewDigalog open={addReviewDialog} handleOpen={() => { setAddReviewDialog(state => !state) }} update={changeReviewStatus} reviewId={currUserReview} productId={id} userId={user?._id} />
        </>
    )
}

export default Product