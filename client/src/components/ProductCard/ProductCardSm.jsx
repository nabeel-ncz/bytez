import React, { useState } from 'react'
import StarCard from '../StarRating/StarCard'
import CardColour from '../CardColour/CardColour'
import { IconButton } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

function ProductCardSm({ id, image, varients, title, description, price }) {
    const [like, setLike] = useState(false)
    const navigate = useNavigate();
    return (
        <>
            <div onClick={() => navigate(`/product/${id}`)} className='card w-[340px] bg-white flex items-center justify-center py-2' style={{ "boxShadow": "0px 1px 20px 2px rgba(0, 0, 0, 0.08)" }}>
                <div className='img-container w-1/3 flex items-center justify-center'>
                    <img src={image ? `http://localhost:3000/products/resized/${image}` : "/images/dummy-product-1.webp"} alt="" className='w-full' />
                </div>
                <div className='w-2/3 flex flex-col items-center justify-center'>
                    <div className='relative w-full flex flex-col px-6 py-4 items-start'>
                        <div className='w-full flex items-center justify-between'>
                            <div className='absolute'><StarCard /></div>
                            <div className='w-full flex items-center justify-end px-2' onClick={(event) => {
                                event.stopPropagation();
                                setLike(state => !state);
                            }}>
                                <button >
                                    {like ?
                                        <img src="/icons/heart-red-icon.png" alt="" className='w-5 h-5' />
                                        : <img src="/icons/heart-icon.png" alt="" className='w-5 h-5' />
                                    }
                                </button>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-between mt-1'>
                            <h2 className='font-semibold text-xl'>₹{price}</h2>
                        </div>
                        <div className='w-full flex flex-col items-start'>
                            <h2 className='w-full text-start font-semibold text-base truncate'>{title}</h2>
                            <h2 className="w-full text-start font-light text-xs truncate">{description}</h2>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ProductCardSm