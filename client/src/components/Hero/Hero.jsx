import React, { useEffect, useState } from 'react'
import CustomCarousel from '../CustomCarousel/CustomCarousel'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCarouselImages, getAllPosterImages } from '../../store/actions/admin/adminActions';
import { BASE_URL } from '../../constants/urls';

function Hero() {
    const dispatch = useDispatch();
    const carouselImages = useSelector(state => state?.admin?.carousel?.data);
    const posterImages = useSelector(state => state?.admin?.poster?.data);

    const [posterOne, setPosterOne] = useState(-1);
    const [posterTwo, setPosterTwo] = useState(-1);

    const generateRandomNumber = (max, min) => {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    useEffect(() => {
        dispatch(getAllCarouselImages());
        dispatch(getAllPosterImages()).then((response) => {
            if (response?.payload?.status === "ok") {
                const length = response?.payload?.data?.length;
                if(length > 2){
                    setPosterOne(generateRandomNumber(0, length));
                    setPosterTwo(generateRandomNumber(0, length));
                } else if (length === 2){
                    setPosterOne(0);
                    setPosterTwo(1);
                }
            }
        });
    }, []);

    return (
        <>
            <div className='w-full flex flex-col lg:flex-row items-center justify-center gap-[25px] px-6 md:p-0'>
                <div className='h-[548px] hidden lg:flex flex-col items-center justify-between'>
                    <img src={posterOne !== -1 ? `${BASE_URL}/banners/resized/${posterImages[posterOne]?.image}` : "/images/bytez-banner-1.png"} alt="" className='w-[386px] h-[255px] self-start rounded-lg' />
                    <img src={posterTwo !== -1 ? `${BASE_URL}/banners/resized/${posterImages[posterTwo]?.image}` : "/images/bytez-banner-2.png"} alt="" className='w-[386px] h-[255px] self-end rounded-lg' />
                </div>
                <CustomCarousel images={carouselImages} />
                <div className='md:hidden w-full flex items-center justify-between'>
                    <img src="/images/bytez-banner-1.png" alt="" className='w-[49%]' />
                    <img src="/images/bytez-banner-2.png" alt="" className='w-[49%]' />
                </div>
            </div>
            <div className='my-8 w-full'>
                <img src="/images/between-section-1.png" alt="" className='w-full' />
            </div>
        </>
    )
}

export default Hero