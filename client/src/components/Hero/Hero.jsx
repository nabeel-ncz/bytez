import React from 'react'
import CustomCarousel from '../CustomCarousel/CustomCarousel'

function Hero() {
    return (
        <>
            <div className='w-full mt-24 px-24 flex items-center justify-center gap-[25px]'>
                <div className='h-[548px] flex flex-col items-center justify-between'>
                    <img src="/images/bytez-banner-1.png" alt="" className='w-[386px] h-[255px] self-start' />
                    <img src="/images/bytez-banner-2.png" alt="" className='w-[386px] h-[255px] self-end' />
                </div>
                <CustomCarousel />
            </div>
            <div className='my-8 w-full'>
                <img src="/images/between-section-1.png" alt="" className='w-full' />
            </div>
        </>
    )
}

export default Hero