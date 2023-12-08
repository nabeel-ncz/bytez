import React, { useState } from 'react'
import { BASE_URL } from '../../constants/urls';

function ProductImageSlider({ images, handleHeroImage }) {
    const itemsPerRow = 3;
    const [startIndex, setStartIndex] = useState(0);

    const nextSlide = () => {
        const nextIndex = startIndex + itemsPerRow;
        if (nextIndex < images.length) {
            setStartIndex(nextIndex);
        }
    };

    const prevSlide = () => {
        const prevIndex = startIndex - itemsPerRow;
        if (prevIndex >= 0) {
            setStartIndex(prevIndex);
        }
    };

    return (
        <div className="text-center w-full flex items-center justify-center gap-4">
            {console.log(images)}
            <button
                onClick={prevSlide}
                className={`px-2 py-1 bg-white text-white rounded-full ${startIndex === 0 && "opacity-50"}`}
                disabled={startIndex === 0}
            >
                <img src="/icons/arrow-icon.png" alt="" className='w-8 rotate-90 opacity-80' />
            </button>
            <div className="w-full grid grid-cols-3 gap-2 lg:gap-8">
                {images.slice(startIndex, startIndex + itemsPerRow).map((image, index) => (
                    <img
                        key={index}
                        src={`${BASE_URL}/products/resized/${image}`}
                        alt={`Image ${index}`}
                        className="w-24 h-auto border border-gray-400 rounded lg:p-2"
                        onClick={() => handleHeroImage(image)}
                    />
                ))}
            </div>
            <button onClick={nextSlide}
                className={`px-2 py-1 rounded-full bg-white text-white ${startIndex + itemsPerRow >= images.length && "opacity-50"}`}
                disabled={startIndex + itemsPerRow >= images.length}>
                <img src="/icons/arrow-icon.png" alt="" className='w-8 -rotate-90 opacity-80' />
            </button>
        </div>
    );
}

export default ProductImageSlider