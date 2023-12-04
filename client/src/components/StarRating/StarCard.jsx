import React from 'react'

function StarCard({value}) {
  return (
    <div className="flex w-[52.27px] items-center px-[4px] py-0 relative bg-[#ffdcb4] rounded-[42.37px]">
      <img className="relative w-[20px] h-[20px]" alt="Frame" src="/icons/star-icon.png" />
      <div className="relative w-fit font-bold text-[#d48d3b] text-xs">
        {Number(value).toString().length === 1 ? `${value}.0` : value}
      </div>
    </div>
  )
}

export default StarCard;