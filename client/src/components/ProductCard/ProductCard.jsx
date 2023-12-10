import React, { useEffect, useState } from 'react'
import StarCard from '../StarRating/StarCard'
import CardColour from '../CardColour/CardColour'
import { IconButton } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AddItemToWishlist, removeItemFromWishlist } from '../../store/actions/user/userActions';
import { BASE_URL } from '../../constants/urls';

function ProductCard({ id, image, varients, title, description, price, rating }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.user?.data);
    const wishlist = useSelector(state => state?.user?.wishlist?.data);
    const [likedItems, setLikedItems] = useState(null);

    const [like, setLike] = useState(false)
    const handleAddToWishlist = () => {
        dispatch(AddItemToWishlist({
            userId: user?._id,
            productId: id,
            varientId: varients[0]?.varientId
        }))
    }

    const handleRemoveFromWishlist = () => {
        dispatch(removeItemFromWishlist({
            userId: user?._id,
            productId: id,
        }));
    }

    return (
        <>
            {console.log(wishlist)}
            <div onClick={() => navigate(`/product/${id}`)} className='card w-[200px] lg:w-[240px] h-[260px] lg:h-[300px] relative bg-white flex flex-col' style={{ "boxShadow": "0px 1px 20px 2px rgba(0, 0, 0, 0.08)" }}>
                <div className='my-4 img-container relative w-full flex items-center justify-center'>
                    <img src={image ? `${BASE_URL}/products/resized/${image}` : "/images/dummy-product-1.webp"} alt="" className='h-[120px] lg:h-[160px]' />
                    <div className='absolute top-0 right-4' onClick={(event) => {
                        event.stopPropagation();
                        setLike(state => !state);
                    }}>
                        {user && (
                            <>
                                {wishlist?.includes(id) ? (
                                    <IconButton variant="text" onClick={handleRemoveFromWishlist}>
                                        <img src="/icons/heart-red-icon.png" alt="" className='w-5 h-5' />
                                    </IconButton>
                                ) : (
                                    <IconButton variant="text" onClick={handleAddToWishlist}>
                                        <img src="/icons/heart-icon.png" alt="" className='w-5 h-5' />
                                    </IconButton>
                                )}
                            </>
                        )}
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
                            <h2 className='font-semibold text-xl lg:text-2xl'>₹{price}</h2>
                            {(rating && rating !== 0) && (
                                <StarCard value={rating} />
                            )}
                        </div>
                        <div className='w-full flex flex-col items-start'>
                            <h2 className='w-full text-start font-semibold text-base lg:text-lg truncate'>{title}</h2>
                            <h2 className="w-full text-start font-light text-xs truncate">{description}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard