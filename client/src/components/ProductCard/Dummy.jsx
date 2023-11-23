import React, { useState } from 'react'
import StarCard from '../StarRating/StarCard'
import CardColour from '../CardColour/CardColour'
import { IconButton } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

function Dummy() {
    const [like, setLike] = useState(false)
    const navigate = useNavigate();
    return (
        <>
            <div onClick={() => navigate(`/`)} className='card w-[140px] h-[180px] relative bg-white flex flex-col' style={{ "boxShadow": "0px 1px 20px 2px rgba(0, 0, 0, 0.08)" }}>
                <div className='my-4 img-container relative w-full flex items-center justify-center'>
                    <img src="/images/dummy-product-1.webp" alt="" className='w-[60px]' />
                    <div className='absolute top-0 right-4' onClick={() => {
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
                    <div className='hidden lg:flex items-center justify-center gap-2'>
                        <CardColour status={true} color={"#09132e"} />
                        <CardColour status={false} color={"#a9db02"} />
                        <CardColour status={false} color={"#8c0b43"} />
                        <CardColour status={false} color={"#24262b"} />
                    </div>
                    {/* <StarCard /> */}
                    <div className='w-full flex flex-col px-6 py-4 items-start'>
                        <div className='w-full flex items-center justify-between'>
                            <h2 className='font-semibold text-2xl'>₹ 2000</h2>
                            <StarCard />
                        </div>
                        <div className='w-full flex flex-col items-start'>
                            <h2 className='font-semibold text-lg'>IPhone 15 Pro</h2>
                            <h2 className="w-full text-start font-light text-xs truncate">Lorem ipsum dolor sit amet consectetur</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dummy;