import React from 'react';
import { Carousel } from "@material-tailwind/react";
import { BASE_URL } from '../../constants/urls';

function CustomCarousel({ images }) {

    return (
        <div className='w-full h-[246px] md:w-[870px] md:h-[546px] md:z-auto' >
            {console.log(images)}
            <Carousel
                className="rounded-xl bg-[#79baef65] overflow-hidden"
                navigation={({ setActiveIndex, activeIndex, length }) => (
                    <div className="absolute bottom-4 left-2/4 flex -translate-x-2/4 gap-2">
                        {new Array(length).fill("").map((_, i) => (
                            <span
                                key={i}
                                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"}`}
                                onClick={() => setActiveIndex(i)}
                            />
                        ))}
                    </div>
                )}
            >
                {images?.map((item) => (
                    <img
                        src={`${BASE_URL}/banners/resized/${item.image}`}
                        alt="image 1"
                        className="absolute object-cover"
                    />
                ))}
            </Carousel>
        </div>
    )
}

export default CustomCarousel