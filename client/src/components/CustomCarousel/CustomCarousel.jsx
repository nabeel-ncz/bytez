import React from 'react';
import { Carousel } from "@material-tailwind/react";

function CustomCarousel() {
    return (
        <div className='w-[870px] h-[546px]' >
            <Carousel
                className="rounded-xl bg-[#79baef65]"
                navigation={({ setActiveIndex, activeIndex, length }) => (
                    <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
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
                <img
                    src="/images/bytez-main-banner-trsp.png"
                    alt="image 1"
                    className="h-full absolute left-8 object-cover"
                />
                <img
                    src="/images/bytez-main-banner-trsp.png"
                    alt="image 2"
                    className="h-full absolute left-8 object-cover"
                />
            </Carousel>
        </div>
    )
}

export default CustomCarousel