import React from 'react'
import CustomCarousel from '../CustomCarousel/CustomCarousel'

function Hero() {
    return (
        <>
            <div className='w-full flex flex-col lg:flex-row items-center justify-center gap-[25px] px-6 md:p-0'>
                <div className='h-[548px] hidden lg:flex flex-col items-center justify-between'>
                    <img src="/images/bytez-banner-1.png" alt="" className='w-[386px] h-[255px] self-start' />
                    <img src="/images/bytez-banner-2.png" alt="" className='w-[386px] h-[255px] self-end' />
                </div> 
                <CustomCarousel />
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