import React from 'react'

function StarCardLarge({ value }) {
    return (
        <div className="inline-flex items-center gap-[10.99px] px-[15.69px] py-[10.99px] relative bg-[#fbf3ea] rounded-[42.37px]">
            <img className="relative w-6 h-6" alt="Frame" src="/icons/Frame-star-icon.png" />
            <div className="relative w-fit mt-[-1.57px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#d48d3b] text-[22px] tracking-[0] leading-[normal]">
                {Number(value).toString().length === 1 ? `${value}.0` : value}
            </div>
        </div>
    )
}

export default StarCardLarge;
