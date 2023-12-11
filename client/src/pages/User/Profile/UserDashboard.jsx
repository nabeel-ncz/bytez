import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, generateReferralCode, getAddress, getAllAddresses } from '../../../store/actions/user/userActions';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageLoading from '../../../components/Loading/PageLoading';

function UserDashboard() {
    const [defaultAddress, setDefaultAddress] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.user?.data);
    const userLoading = useSelector(state => state.user?.user?.loading);
    const [link, setLink] = useState(null);
    const location = useLocation();

    useEffect(() => {
        dispatch(fetchUser()).then((userData) => {
            if (userData?.payload?.status === "ok") {
                dispatch(getAllAddresses(userData?.payload?.data._id)).then((response) => {
                    if (response?.payload?.status === "ok") {
                        const result = response?.payload?.data?.addresses?.filter((doc) => doc._id === response?.payload?.data?.defaultAddress);
                        setDefaultAddress(result ? result[0] : null);
                    }
                })
            }
        })
    }, []);

    useEffect(() => {
        if (user) {
            dispatch(generateReferralCode(user?._id)).then((response) => {
                if (response?.payload?.status === "ok") {
                    setLink(`${window.location.protocol}://${window.location.host}/signup?referral=${response?.payload?.data?.code}`);
                }
            })
        }
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link);
        toast("Link copied successfully!");
    }

    return (
        <>
            {userLoading ? <PageLoading /> : (
                <div className='w-full lg:w-9/12 shadow-sm'>
                    {/* <div className='flex items-center justify-between gap-4'>
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
                </div> */}
                    <div className='flex flex-col items-start justify-center gap-2 mt-6'>
                        <h2 className='text-lg font-medium'>Hello, {user?.name}</h2>
                        <p className='text-start font-light text-xs'>From your account dashboard. you can easily check & view your Recent Orders, manage your Shipping and Billing Addresses and edit your Password and Account Details.</p>
                    </div>
                    <div className='w-full flex md:flex-row flex-col items-start justify-between gap-12 mt-6'>
                        <div className='w-full md:w-1/2 bg-white py-4 rounded shadow-sm'>
                            <div className='w-full border-b border-gray-600 ps-4 pb-2'>
                                <h2 className='text-start font-medium text-sm'>Account Info</h2>
                            </div>
                            <div className='flex flex-col items-start justify-center ps-4 py-6 gap-2 text-start'>
                                <h2 className='font-medium text-sm'>Name : {user?.name}</h2>
                                <h2 className='font-medium text-sm'>Email : {user?.email}</h2>
                                <h2 className='font-medium text-sm'>Phone : {user?.phone ? user.phone : defaultAddress?.phone}</h2>
                            </div>
                        </div>
                        <div className='w-full md:w-1/2 bg-white py-4 rounded shadow-sm'>
                            <div className='w-full border-b border-gray-600 ps-4 pb-2'>
                                <h2 className='text-start font-medium text-sm'>Default Address</h2>
                            </div>
                            {defaultAddress ? (
                                <div className='flex flex-col items-start justify-center ps-4 py-6 gap-2 text-start'>
                                    <h2 className='font-medium text-sm'>{defaultAddress?.firstName} {defaultAddress?.lastName}</h2>
                                    <p className='font-medium text-sm opacity-80'>{defaultAddress?.houseAddress}, {defaultAddress?.city}, {defaultAddress?.state} Pin: {defaultAddress?.zipcode}</p>
                                    <h2 className='font-medium text-sm opacity-80'>Phone: {defaultAddress?.phone}</h2>
                                    <h2 className='font-medium text-sm opacity-80'>Email: {defaultAddress?.email}</h2>
                                </div>
                            ) : (
                                <h2>Please add an address</h2>
                            )}
                        </div>
                    </div>
                    {link && (
                        <div className='w-full flex text-start items-start justify-between mt-6 bg-white px-4 py-4'>
                            <div className='w-8/12'>
                                <h2 className='overflow-clip'>Referral Link : <span className='text-xs font-medium text-blue-400'>{link}</span></h2>
                            </div>
                            <div className='w-4/12 flex items-center justify-end'>
                                <button onClick={handleCopyLink} className='px-2 py-1 border border-gray-800 rounded hover:bg-gray-100'>copy</button>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </>
    )
}

export default UserDashboard