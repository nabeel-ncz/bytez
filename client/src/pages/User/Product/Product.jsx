import React, { useEffect, useState } from 'react'
import ProductImageSlider from '../../../components/Slider/ProductImageSlider'
import { Chip, Rating, Button, IconButton } from '@material-tailwind/react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CardZoom from '../../../components/Cards/CardZoom';

function Product() {
    const [product, setProduct] = useState(null);
    const [selectedVarient, setSelectedVarient] = useState(0);
    const [heroImage, setHeroImage] = useState(null);
    const [productImages, setProductImages] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        axios.get(`http://localhost:3000/products/view/${id}`, { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                console.log(response.data?.data)
                setProduct(response.data?.data);
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

    const handleHeroImage = (image) => {
        setHeroImage(image)
    }

    return (
        <>
            {product ? (
                <div className='w-full h-screen flex items-start justify-between pt-12 px-20'>
                    <div className='w-1/2 flex flex-col items-center justify-center gap-14'>
                        {/* <img src="/images/dummy-product-1.webp" alt="" className='w-60' /> */}
                        <CardZoom image={heroImage} />
                        <div className=''>
                            <ProductImageSlider handleHeroImage={handleHeroImage} images={product ? [...productImages] : []} />
                        </div>
                    </div>
                    <div className="lg:w-1/2 pt-12">
                        <h1 className="text-2xl font-bold text-start">{product?.title}</h1>
                        <div className="flex flex-col items-start text-sm gap-1 mt-2 ">
                            <span className="text-yellow-400 flex gap-1">
                                <Rating value={4} />
                            </span>
                            <p className="font-semibold">
                                4.7 Star Rating
                                <span className="text-gray-500">(20 User Feedback)</span>
                            </p>
                        </div>
                        <p className='text-start w-10/12'>{product?.varients[selectedVarient]?.description}</p>
                        <div className="flex flex-col items-start text-gray-500 my-3">
                            <p className='flex'>
                                Availability:{" "}
                                <Chip value={product?.varients[selectedVarient]?.status} color='green' variant='ghost' />
                            </p>
                            <p>
                                Brand: <span className="font-semibold">{product?.brand}</span>
                            </p>
                            <p>
                                Category:{" "}
                                <span className="font-semibold">{product?.category}</span>
                            </p>
                        </div>
                        <p className="text-xl font-semibold my-2 flex items-center justify-start">
                            <span className="text-blue-gray-900 me-2">
                                ₹ {product?.varients[selectedVarient]?.discountPrice}
                            </span>
                            <span className="text-gray-500 line-through">
                                ₹ {product?.varients[selectedVarient]?.discountPrice}
                            </span>
                        </p>
                        <p className="bg-orange-500 px-4 py-2 w-fit text-base rounded">
                            25% Off
                        </p>

                        <div className="flex gap-3 w-full mt-4">
                            <Button variant="gradient" className='w-10/12'>Add to cart</Button>
                            <IconButton variant="outlined" className='w-2/12'>
                                <img src="/icons/heart-icon.png" alt="" className='w-5 h-5' />
                            </IconButton>
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