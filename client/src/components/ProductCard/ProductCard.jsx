import React, { useState } from 'react'
import StarCard from '../StarRating/StarCard'
import CardColour from '../CardColour/CardColour'
import { IconButton } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

function ProductCard({ id, image, varients, title, description, price }) {
    const [like, setLike] = useState(false)
    const navigate = useNavigate();
    return (
        <>
            <div onClick={() => navigate(`/product/${id}`)} className='card w-[240px] h-[280px] relative bg-white flex flex-col' style={{ "boxShadow": "0px 1px 20px 2px rgba(0, 0, 0, 0.08)" }}>
                <div className='my-4 img-container relative w-full flex items-center justify-center'>
                    <img src={image ? `http://localhost:3000/products/resized/${image}` : "/images/dummy-product-1.webp"} alt="" className='h-[115px]' />
                    <div className='absolute top-0 right-4' onClick={(event) => {
                        event.stopPropagation();
                        setLike(state => !state);
                    }}>
                        <IconButton variant="text">
                            {like ?
                                <img src="/icons/heart-red-icon.png" alt="" className='w-5 h-5' />
                                : <img src="/icons/heart-icon.png" alt="" className='w-5 h-5' />
                            }
                        </IconButton>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    {/* <div className='flex items-center justify-center gap-2'>
                        {[...new Set(varients.map(doc => doc.color))].map(color => (
                            <CardColour status={false} color={color} key={color} />
                        ))}
                    </div> */}
                    {/* <StarCard /> */}
                    <div className='w-full flex flex-col px-6 py-4 items-start'>
                        <div className='w-full flex items-center justify-between'>
                            <h2 className='font-semibold text-2xl'>₹{price}</h2>
                            <StarCard />
                        </div>
                        <div className='w-full flex flex-col items-start'>
                            <h2 className='font-semibold text-lg'>{title}</h2>
                            <h2 className="w-full text-start font-light text-xs truncate">{description}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard