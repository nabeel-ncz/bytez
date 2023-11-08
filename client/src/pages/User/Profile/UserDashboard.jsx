import React from 'react'

function UserDashboard() {
    return (
        <>
            <div className='w-9/12 shadow-sm'>
                <div className='flex items-center justify-between gap-4'>
                    <div className="text-start w-full px-5 flex items-center justify-start gap-4 bg-blue-100 py-4">
                        <div className='w-fit bg-white p-2'>
                            <img src="/icons/rocket-icon.png" alt="" className='w-10' />
                        </div>
                        <div className='text-start'>
                            <h1 className='font-bold'>154</h1>
                            <h6 className='font-normal'>Total Orders</h6>
                        </div>
                    </div>
                    <div className="text-start w-full px-5 flex items-center justify-start gap-4 bg-orange-100 py-4">
                        <div className='w-fit bg-white p-2'>
                            <img src="/icons/receipt-icon.png" alt="" className='w-10' />
                        </div>
                        <div className='text-start'>
                            <h1 className='font-bold'>14</h1>
                            <h6 className='font-normal'>Pending Orders</h6>
                        </div>
                    </div>
                    <div className="text-start w-full px-5 flex items-center justify-start gap-4 bg-green-100 py-4">
                        <div className='w-fit bg-white p-2'>
                            <img src="/icons/package-icon.png" alt="" className='w-10' />
                        </div>
                        <div className='text-start'>
                            <h1 className='font-bold'>28</h1>
                            <h6 className='font-normal'>Completed Orders</h6>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-start justify-center gap-2 mt-6'>
                    <h2 className='text-lg font-medium'>Hello, Muhammed Nabeel</h2>
                    <p className='text-start font-light text-xs'>From your account dashboard. you can easily check & view your Recent Orders, manage your Shipping and Billing Addresses and edit your Password and Account Details.</p>
                </div>
                <div className='w-full flex items-start justify-between gap-12 mt-6'>
                    <div className='w-1/2 bg-white py-4 rounded shadow-sm'>
                        <div className='w-full border-b border-gray-600 ps-4 pb-2'>
                            <h2 className='text-start font-medium text-sm'>Account Info</h2>
                        </div>
                        <div className='flex flex-col items-start justify-center ps-4 py-6 gap-2'>
                            <h2 className='font-medium text-sm'>Muhammed Nabeel</h2>
                            <h2 className='font-medium text-sm'>Email: nabeel@gmail.com</h2>
                            <h2 className='font-medium text-sm'>Phone: 75585963319</h2>
                        </div>
                    </div>
                    <div className='w-1/2 bg-white py-4 rounded shadow-sm'>
                        <div className='w-full border-b border-gray-600 ps-4 pb-2'>
                            <h2 className='text-start font-medium text-sm'>Default Address</h2>
                        </div>
                        <div className='flex flex-col items-start justify-center ps-4 py-6 gap-2'>
                            <h2 className='font-medium text-sm'>Muhammed Nabeel</h2>
                            <p className='font-medium text-sm opacity-80'>Mikro Grafio, 4th Gate, Calicut Pin: 67372</p>
                            <h2 className='font-medium text-sm opacity-80'>Phone: 75585963319</h2>
                            <h2 className='font-medium text-sm opacity-80'>Email: nabeel@gmail.com</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDashboard