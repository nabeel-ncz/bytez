import React, { useState } from 'react'
import StarCard from '../StarRating/StarCard'
import CardColour from '../CardColour/CardColour'
import { IconButton } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants/urls';
import { useDispatch, useSelector } from 'react-redux';
import { AddItemToWishlist, removeItemFromWishlist } from '../../store/actions/user/userActions';

function ProductCardSm({ id, image, varients, title, description, price, rating }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [like, setLike] = useState(false);
    const user = useSelector(state => state?.user?.user?.data);
    const wishlist = useSelector(state => state?.user?.wishlist?.data);

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
            <div onClick={() => navigate(`/product/${id}`)} className='card w-[340px] bg-white flex items-center justify-center py-2' style={{ "boxShadow": "0px 1px 20px 2px rgba(0, 0, 0, 0.08)" }}>
                <div className='img-container w-1/3 flex items-center justify-center'>
                    <img src={image ? `${BASE_URL}/products/resized/${image}` : "/images/dummy-product-1.webp"} alt="" className='w-full' />
                </div>
                <div className='w-2/3 flex flex-col items-center justify-center'>
                    <div className='relative w-full flex flex-col px-6 py-4 items-start'>
                        <div className='w-full flex items-center justify-between'>
                            <div className='absolute'>
                                {(rating && rating !== 0) && (
                                    <StarCard value={rating} />
                                )}
                            </div>
                            <div className='w-full flex items-center justify-end px-2' onClick={(event) => {
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