import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAvailableUserCouponsApi } from '../../../services/api';

function UserCoupons() {

    const user = useSelector(state => state.user?.user?.data);
    const [coupons, setCoupons] = useState(null);

    useEffect(() => {
        handleFetch();
    }, [user]);

    const handleFetch = async () => {
        getAvailableUserCouponsApi()
            .then((response) => {
                if (response?.data?.status === "ok") {
                    setCoupons(response?.data?.data);
                }
            });
    };
    return (
        <div className='w-full flex items-start justify-start flex-wrap gap-10 px-24'>
            {coupons?.map((item) => (
                <div class="container text-black w-fit">
                    <div class="coupon-card bg-gradient-to-r from-yellow-50 to-orange-100 text-center py-10 px-20 rounded-lg shadow-md relative">
                        <h3 class="text-sm font-normal">{item.discountPercentage}% flat off on the purchase range <br />between ₹{item.minimumApplicableAmount} - ₹{item.maximumApplicableAmount}</h3>
                        <div class="coupon-row items-center mx-auto my-6">
                            <span id="cpnCode" class="border-dashed border-black border px-4 py-2 mr-2">{item.code}</span>
                        </div>
                        <p class="text-base">Valid Till: {new Date(item.validTo).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserCoupons