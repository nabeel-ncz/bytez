import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumbs, Button } from '@material-tailwind/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createCoupon, getCouponDetails, updateCoupon } from '../../../store/actions/admin/adminActions';
import toast from 'react-hot-toast';

function UpdateCoupon() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState({
        code: "",
        validFrom: "",
        validTo: "",
        discountPercentage: "",
        minimumApplicableAmount: 0,
        maximumApplicableAmount: 0,
        couponType: "public_coupon",
        maxUsesPerUser: 1,
        minimumPurchaseAmount: ""
    });
    const { id } = useParams();

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        if (!id) {
            navigate('/coupons');
        } else {
            dispatch(getCouponDetails(id)).then((response) => {
                if (response?.payload?.status === "ok") {
                    setData((state) => ({
                        ...state,
                        ...response?.payload?.data,
                    }));
                } else {
                    navigate('/coupons');
                }
            }).catch(() => {
                navigate('/coupons');
            })
        }
    }

    const handleChange = (event) => {
        setData((state) => ({
            ...state,
            [event.target.name]: event.target.value,
        }));
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (data?.minimumApplicableAmount <= data?.maximumApplicableAmount) {
            let dateTo = new Date(data?.validTo)
            let dateFrom = new Date(data?.validFrom)
            if (dateTo - dateFrom > 0) {
                dispatch(updateCoupon({ ...data, id })).then(() => {
                    navigate(-1);
                })
            } else {
                toast.error("Invalid date, please choose correct date!");
            }
        } else {
            toast.error("Invalid Minimum or Maximum applicable amount!");
        }
    };

    return (
        <>
            <div className="p-5 w-full overflow-y-auto">
                <div className="flex justify-between items-center text-xs font-semibold">
                    <div>
                        <h1 className="font-bold text-2xl">Update Coupon</h1>
                        <Breadcrumbs>
                            <Link to={"/admin"} className="opacity-60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" ><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                            </Link>
                            <Link to={"/admin/coupons"}>
                                Coupons
                            </Link>
                            <Link to={`/admin/coupons/update/${id}`}>
                                Update Coupon
                            </Link>
                        </Breadcrumbs>
                    </div>
                    <div className="flex gap-3">
                    </div>
                </div>
                <div className="overflow-x-scroll lg:overflow-hidden flex items-start w-1/2">
                    <form onSubmit={handleFormSubmit} className='mt-6 w-full flex flex-col items-start gap-2'>
                        <label >Coupon Code : </label>
                        <input name='code' onChange={handleChange} value={data?.code} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label >Valid From : </label>
                        <input type='datetime-local' name='validFrom' onChange={handleChange} value={data?.validFrom && new Date(data?.validFrom)?.toISOString()?.slice(0, 16)} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label >Valid To : </label>
                        <input type='datetime-local' name='validTo' onChange={handleChange} value={data?.validTo && new Date(data?.validTo)?.toISOString()?.slice(0, 16)} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label >Discount Percentage : </label>
                        <input type='number' name='discountPercentage' min={0} max={100} onChange={handleChange} value={data?.discountPercentage} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label >Maximum Uses Per User : </label>
                        <input type='number' min={1} name='maxUsesPerUser' onChange={handleChange} value={data?.maxUsesPerUser} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label >Minimum Applicable Amount : </label>
                        <input type='number' name='minimumApplicableAmount' onChange={handleChange} value={data?.minimumApplicableAmount} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label >Maximum Applicable Amount : </label>
                        <input type='number' name='maximumApplicableAmount' onChange={handleChange} value={data?.maximumApplicableAmount} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label >Coupon Type : </label>
                        <label htmlFor="" >
                            <input type="radio" name='couponType' value={"public_coupon"} checked={data?.couponType === "public_coupon"} onChange={handleChange} required />
                            Public Coupon
                        </label>
                        <label htmlFor="">
                            <input type="radio" name='couponType' value={"private_coupon"} checked={data?.couponType === "private_coupon"} onChange={handleChange} required />
                            Private Coupon
                        </label>
                        <label htmlFor="">
                            <input type="radio" name='couponType' value={"welcome_coupon"} checked={data?.couponType === "welcome_coupon"} onChange={handleChange} required />
                            Welcome Coupon
                        </label>
                        {
                            data?.couponType === "private_coupon" && (
                                <>
                                    <label >Minimum Purchase Amount : </label>
                                    <input type='number' name='minimumPurchaseAmount' onChange={handleChange} value={data?.minimumPurchaseAmount} required className='w-full h-12 bg-white rounded border border-gray-700 outline-none' />
                                </>
                            )
                        }
                        <Button type='submit' variant='gradient' className='w-full py-2 mt-4'>Save</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateCoupon;