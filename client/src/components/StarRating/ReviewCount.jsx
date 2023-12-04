import React from 'react'

function ReviewCount({value}) {
    return (
        <div className="inline-flex items-center gap-[10.99px] px-[15.69px] py-[10.99px] relative bg-white rounded-[42.37px]">
            <img className="relative w-[25.11px] h-[25.11px]" alt="Frame" src="/icons/Frame-review-count.png" />
            <div className="relative w-fit mt-[-1.57px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#060606] text-[22px] tracking-[0] leading-[normal]">
                {value} Reviews
            </div>
        </div>
    )
}

export default ReviewCount