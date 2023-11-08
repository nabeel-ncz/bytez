import React from 'react';
import { Button } from "@material-tailwind/react"
import { useNavigate } from 'react-router-dom';

function ShippingAddress() {
    const navigate = useNavigate();
    return (
        <div className='w-9/12 shadow-sm'>
            <div className='w-full flex items-center justify-end mb-4'>
                <Button onClick={() => {navigate('create')}}>Add Address</Button>
            </div>
            <div className='flex flex-col w-full items-start justify-start gap-4'>
                <div className='w-full bg-white rounded shadow-sm'>
                    <div className='w-full flex items-center justify-between border-b border-gray-400 px-6 py-3'>
                        <input type="radio" className=''/>
                        <div className='flex items-center gap-2'>
                            <img src="/icons/bin.png" alt="" className='w-9 border border-gray-400 p-2'/>
                            <img src="/icons/edit-icon.png" alt="" className='w-9 border border-gray-400 p-2' />
                        </div>
                    </div>
                    <div className='w-full flex flex-col items-start px-6 py-3 font-medium text-sm'>
                        <h2>Muhammed Nabeel</h2>
                        <p className='opacity-70'>Micro Grafeio, Therveedu Road, Kozhikode, KERALA 673032, India</p>
                        <h2 className='opacity-70'>Phone : 758589303</h2>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ShippingAddress