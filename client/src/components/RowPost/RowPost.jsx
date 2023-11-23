import React from 'react'
import ProductCard from '../ProductCard/ProductCard'
import Dummy from '../ProductCard/Dummy'

function RowPost() {
  return (
    <>
        <div className='w-full pb-6 px-6 lg:px-32 flex items-center justify-between'>
            <h2 className='underline text-lg font-semibold'>Top Selling</h2>
            <div className='flex items-center justify-center gap-2'>
                <img src="/icons/arrow-icon.png" alt="" className='w-6 h-6 rotate-90' />
                <img src="/icons/arrow-icon.png" alt="" className='w-6 h-6 -rotate-90' />
            </div>
        </div>
        <div className='w-full pb-12 px-6 lg:px-32 flex flex-row items-center justify-between'>
            <Dummy />
            <Dummy />
        </div>
    </>
  )
}

export default RowPost