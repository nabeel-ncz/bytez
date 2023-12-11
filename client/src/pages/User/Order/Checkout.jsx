import React, { useEffect, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { getAllAddresses, fetchUser, getAllCartProducts, createOrder, validateCoupon } from '../../../store/actions/user/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OrderSuccessfull from '../../../components/CustomDialog/OrderSuccessfull';
import { createOrderApi, getRazorpayKeyApi, verifyPaymentApi } from '../../../services/api';
import { BASE_URL } from '../../../constants/urls';
import PageLoading from '../../../components/Loading/PageLoading';

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [successDialog, setSuccessDialog] = useState(false);

    const handleDialogOpen = () => {
        setSuccessDialog(state => !state);
    }

    const [defaultAddress, setDefaultAddress] = useState(null);
    const user = useSelector(state => state.user?.user?.data);
    const cart = useSelector(state => state.user?.cart?.data);
    const userLoading = useSelector(state => state.user?.user?.loading);
    const cartLoading = useSelector(state => state.user?.cart?.loading);

    const [paymentMode, setPaymentMode] = useState("COD");
    const [orderNote, setOrderNote] = useState("");

    const handleOrderNoteChange = (event) => {
        setOrderNote(event.target.value);
    }

    useEffect(() => {
        handleValidateCoupon();
    }, []);

    const handleValidateCoupon = () => {
        if (cart?.couponApplied > 0) {
            dispatch(validateCoupon({ id: cart?.coupon, price: (cart?.subTotal - cart?.discount) })).then((response) => {
                if (response.payload?.status === "error" || response?.error) {
                    navigate('/cart');
                    toast.error(response?.payload?.message || response?.error?.message);
                }
            })
        }
    };

    const initOnlinePayment = (key, data) => {
        const options = {
            key,
            amount: data?.amount,
            currency: data?.currency,
            name: "Bytez",
            description: "Test Transaction",
            order_id: data?.id,
            handler: function (response) {
                verifyPaymentApi(response).then((result) => {
                    if (result.data?.status === "ok") {
                        dispatch(createOrder({
                            userId: user?._id,
                            cartId: cart?._id,
                            paymentMode: paymentMode,
                            orderNote: orderNote,
                            addressId: defaultAddress?._id,
                        })).then((response) => {
                            if (response.error) {
                                toast.error(response?.error?.message);
                                navigate('/cart');
                            } else if (response.payload.status === "ok") {
                                handleDialogOpen();
                            } else if (response.payload?.status === 'error') {
                                toast.error(response.payload?.message);
                            } else {
                                toast.error(response?.error?.message);
                            }
                        })
                    }
                }).catch((error) => {
                    console.log(error);
                })
            },
            prefill: {
                name: user?.name,
                email: user?.email,
                contact: user?.phone ?? 9898234587,
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc",
            },
        }
        const razorPay = new window.Razorpay(options);
        razorPay.open();

        razorPay.on("payment.failed", function (response) {
            toast.error(response.error.description);
        });
    }

    const handleCheckout = () => {
        dispatch(validateCoupon({ id: cart?.coupon, status: cart?.couponApplied, price: (cart?.subTotal - cart?.discount) })).then((response) => {
            if (response.payload?.status === "error" || response?.error) {
                navigate('/cart');
                toast.error(response?.payload?.message || response?.error?.message);
            } else {
                if (!user) {
                    toast.error("User not exist!, Please Authenticate");
                } else if (!cart) {
                    toast.error("There is no items in the cart");
                } else if (!defaultAddress) {
                    toast.error("Please add an address first!");
                } else {
                    if (paymentMode === "RazorPay") {
                        createOrderApi({ totalAmount: cart?.totalPrice, cartId: cart?._id }).then((result) => {
                            if (result?.data?.status === "ok") {
                                const data = result?.data?.data;
                                getRazorpayKeyApi().then((response) => {
                                    if (response.data?.status === "ok") {
                                        const key = response?.data?.data?.razorpay_key;
                                        initOnlinePayment(key, data);
                                    }
                                }).catch((error) => {
                                    toast.error(error?.message);
                                })
                            } else {
                                toast.error(result.data?.message ?? (result.error?.message ? result.error?.message : "There is something went wrong!"))
                            }
                        }).catch((error) => {
                            toast.error(error?.message);
                        })
                    } else if (paymentMode === "COD") {
                        dispatch(createOrder({
                            userId: user?._id,
                            cartId: cart?._id,
                            paymentMode: paymentMode,
                            orderNote: orderNote,
                            addressId: defaultAddress?._id,
                        })).then((response) => {
                            if (response.error) {
                                toast.error(response?.error?.message);
                                navigate('/cart');
                            } else if (response.payload.status === "ok") {
                                handleDialogOpen();
                            } else if (response.payload?.status === 'error') {
                                toast.error(response.payload?.message);
                            } else {
                                toast.error(response?.error?.message);
                            }
                        });
                    } else if (paymentMode === "Wallet") {
                        if (user?.wallet >= cart?.totalPrice) {
                            dispatch(createOrder({
                                userId: user?._id,
                                cartId: cart?._id,
                                paymentMode: paymentMode,
                                orderNote: orderNote,
                                addressId: defaultAddress?._id,
                            })).then((response) => {
                                if (response.error) {
                                    toast.error(response?.error?.message);
                                    navigate('/cart');
                                } else if (response.payload.status === "ok") {
                                    handleDialogOpen();
                                } else if (response.payload?.status === 'error') {
                                    toast.error(response.payload?.message);
                                } else {
                                    toast.error(response?.error?.message);
                                }
                            });
                        } else {
                            toast.error("There is no enough money in the wallet");
                        }
                    } else {
                        toast("Please choose a available payment mode");
                    }
                }
            }
        })
    }

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
        dispatch(getAllCartProducts(user?._id));
    }, []);

    return (
        <>
            {(userLoading || cartLoading) ? <PageLoading /> : (
                <div className='w-full flex xl:flex-row flex-col items-start justify-center px-4 lg:px-12 xl:px-24 py-6 gap-10'>
                    <div className='xl:w-8/12 w-full flex flex-col items-start gap-4'>
                        <div className='w-full bg-white rounded shadow-sm'>
                            <div className='w-full flex items-center justify-end border-b border-gray-200 px-6 py-1'>
                                <div className='flex items-center gap-2'>
                                    {defaultAddress ? (
                                        <span onClick={() => navigate('/profile/address')} className='px-4 py-2 bg-black text-white text-xs'>Change</span>
                                    ) : (
                                        <span onClick={() => navigate('/profile/address/create?from_orders=true')} className='px-4 py-2 bg-black text-white text-xs'>Add Address</span>
                                    )}
                                </div>
                            </div>
                            <div className='w-full flex flex-col items-start px-6 py-3 font-medium text-sm'>
                                {defaultAddress && (
                                    <>
                                        <h2 className='font-medium text-sm'>{defaultAddress?.firstName} {defaultAddress?.lastName}</h2>
                                        <p className='font-medium text-sm opacity-80 text-start'>{defaultAddress?.houseAddress}, {defaultAddress?.city}, {defaultAddress?.state} Pin: {defaultAddress?.zipcode}</p>
                                        <h2 className='font-medium text-sm opacity-80'>Phone: {defaultAddress?.phone}</h2>
                                        <h2 className='font-medium text-sm opacity-80'>Email: {defaultAddress?.email}</h2>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='w-full bg-white rounded shadow-sm'>
                            <div className='w-full flex flex-col items-start py-8 font-medium text-sm gap-8'>
                                <div className='w-full flex items-center justify-between border-b border-gray-200 px-6 py-2'>
                                    <h2 className='text-xl font-semibold'>Payment Option</h2>
                                </div>
                                <div className='w-full flex items-center justify-around relative px-6 h-28'>
                                    <div onClick={() => setPaymentMode("COD")} className={`absolute ${paymentMode === "COD" && "border"} border-gray-600 left-5 lg:left-20 transition-all duration-50 cursor-pointer w-28 lg:w-48 h-24 lg:h-32 shadow-md hover:shadow-lg rounded-md hover:w-[7.5rem] hover:h-[6.5rem] lg:hover:w-[12.5rem] lg:hover:h-[8.5rem] h flex flex-col items-center justify-center gap-2`}>
                                        <img src="/icons/cash-on-delivery.png" alt="" className='w-8' />
                                        <h2>Cash on delivery</h2>
                                    </div>
                                    <div onClick={() => setPaymentMode("RazorPay")} className={`absolute ${paymentMode === "RazorPay" && "border"} border-gray-600 transition-all duration-50 cursor-pointer w-28 lg:w-48 h-24 lg:h-32 shadow-md hover:shadow-lg rounded-md hover:w-[7.5rem] hover:h-[6.5rem] lg:hover:w-[12.5rem] lg:hover:h-[8.5rem] h flex flex-col items-center justify-center gap-2`}>
                                        <img src="/icons/credit-card.png" alt="" className='w-8' />
                                        <h2>Online payment</h2>
                                    </div>
                                    <div onClick={() => setPaymentMode("Wallet")} className={`absolute ${paymentMode === "Wallet" && "border"} border-gray-600 transition-all duration-50 cursor-pointer right-5 lg:right-20 w-28 lg:w-48 h-24 lg:h-32 shadow-md hover:shadow-lg hover:w-[7.5rem] hover:h-[6.5rem] rounded-md lg:hover:w-[12.5rem] lg:hover:h-[8.5rem] h flex flex-col items-center justify-center gap-2`}>
                                        <img src="/icons/wallet.png" alt="" className='w-8' />
                                        <h2>Wallet</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full bg-white rounded shadow-sm'>
                            <div className='w-full flex flex-col items-start py-8 font-medium text-sm gap-4'>
                                <div className='w-full flex items-center justify-between border-b border-gray-200 px-6 py-2'>
                                    <h2 className='text-xl font-semibold'>Additional Information</h2>
                                </div>
                                <div className='w-full flex flex-col items-start justify-center px-6'>
                                    <h2>Order Notes (optional)</h2>
                                    <input type="text" onChange={handleOrderNoteChange} value={orderNote} className='bg-gray-200 w-full lg:w-3/4 h-10 rounded outline-none border border-gray-200' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='xl:w-4/12 w-full min-h-screen flex items-start'>
                        <div className='flex flex-col items-start justify-center w-full gap-2 bg-white px-12 py-8'>
                            <h2 className='text-xl font-semibold'>Order Summary</h2>
                            {cart?.items?.map((doc) => (
                                <>
                                    <div className='w-full flex items-center justify-start gap-6 my-2 px-4 py-2 border rounded border-gray-200'>
                                        <div>
                                            <img src={`${BASE_URL}/products/resized/${doc.image}`} alt="" className='w-8' />
                                        </div>
                                        <div className='flex flex-col items-start justify-center'>
                                            <h2 className='font-medium text-xs'>{doc.name} {doc.attributes.ramAndRom}</h2>
                                            <h2 className='font-medium text-xs opacity-50'>{doc.quantity} x ₹ {doc.discountPrice}</h2>
                                        </div>
                                    </div>
                                </>
                            ))}

                            <div className='w-full flex items-center justify-between'>
                                <span>Price</span>
                                <span>₹ {cart?.subTotal}</span>
                            </div>
                            <div className='w-full flex items-center justify-between'>
                                <span>Discount</span>
                                <span>₹ {cart?.discount}</span>
                            </div>
                            <div className='w-full flex items-center justify-between'>
                                <span>Shipping</span>
                                <span>₹ {cart?.shipping} (Free)</span>
                            </div>
                            <div className='w-full flex items-center justify-between'>
                                <span>Coupon Applied</span>
                                <span>₹ 0</span>
                            </div>
                            <div className='w-full mt-4 border-t pt-4 border-gray-800 flex items-center justify-between'>
                                <span>Total</span>
                                <span>₹ {cart?.totalPrice}</span>
                            </div>
                            <div className='w-full flex items-center justify-between'>
                                <span>Estimated delivery by</span>
                                <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                            </div>

                            <div className='w-full flex items-center justify-between mt-4'>
                                <Button onClick={handleCheckout} variant='filled' className='w-full items-center justify-center py-4'>Continue</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <OrderSuccessfull open={successDialog} handleOpen={handleDialogOpen} />
        </>
    )
}

export default Checkout