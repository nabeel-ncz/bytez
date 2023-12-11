import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyCouponInCart, changeCartProductQuantity, deleteProductFromCart, getAllCartProducts } from '../../../store/actions/user/userActions';
import toast from 'react-hot-toast';
import { Button } from '@material-tailwind/react';
import DeleteCartProduct from '../../../components/CustomDialog/deleteCartProduct'
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/Pagination/Pagination';
import RemoveCouponFromCart from '../../../components/CustomDialog/RemoveCouponFromCart';
import { BASE_URL } from '../../../constants/urls';
import PageLoading from '../../../components/Loading/PageLoading';

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.user?.data);
  const cart = useSelector(state => state.user?.cart?.data);
  const cartLoading = useSelector(state => state.user?.cart?.loading);
  const userLoading = useSelector(state => state.user?.user?.loading);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [couponRemoveDialog, setCouponRemoveDialog] = useState(false);

  //pagination
  const [activePage, setActivePage] = useState(0);
  const [totalCartPage, setTotalCartPage] = useState(1);
  const [records, setRecords] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState("not_applied");
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    dispatch(getAllCartProducts(user._id)).then((response) => {
      if (response?.payload?.couponApplied > 0) {
        setCouponStatus('applied');
      }
      setActivePage(1);
    })
  }, []);

  const handlePagination = () => {
    const recordsPerPage = 4;
    setTotalCartPage(Math.ceil(cart?.items?.length / recordsPerPage));
    const lastIndex = (activePage * recordsPerPage);
    const firstIndex = (lastIndex - recordsPerPage);
    setRecords(cart?.items?.slice(firstIndex, lastIndex));
  };

  useEffect(() => {
    handlePagination();
  }, [activePage, cart]);

  const handleQuantity = (productId, varientId, quantity) => {
    dispatch(changeCartProductQuantity({
      quantityToAdd: quantity,
      productId: productId,
      varientId: varientId,
      userId: user?._id,
    })).then((result) => {
      console.log(result);
      if (result?.error) {
        toast.error(result.error?.message);
      } else if (result?.payload?.status === "ok") {
        dispatch(getAllCartProducts(user._id));
      }
    })
  }

  const handleApplyCoupon = () => {
    dispatch(applyCouponInCart({
      id: user?._id,
      cartId: cart?._id,
      couponCode: couponCode,
    })).then((response) => {
      if (response.payload?.status === "ok") {
        dispatch(getAllCartProducts(user._id));
        setCouponStatus('applied');
        setCouponError("");
      } else {
        setCouponStatus('error');
        setCouponError(response.payload?.message || response?.error?.message);
      }
    })
  };

  const handleDialogOpen = () => {
    setDialogOpen(state => !state);
  }

  const handleCouponRemoveDialog = () => {
    setCouponRemoveDialog(state => !state);
  }

  const handleCouponStatus = (status) => {
    setCouponStatus(status);
    setCouponCode("");
  }

  const next = () => {
    if (activePage === totalCartPage) return;
    setActivePage(state => state + 1);
  };
  const prev = () => {
    if (activePage === 1) return;
    setActivePage(state => state - 1);
  };


  return (
    <>
      {(userLoading || cartLoading) ? <PageLoading /> : (
        <div className='w-screen min-h-screen px-4 md:px-24 py-6'>
          {(!cart || cart.items.length === 0) ? <h2>Cart is empty!</h2> : (
            <div className='w-full flex flex-col lg:flex-row items-start justify-center gap-2'>
              <div className='w-full lg:w-8/12 flex flex-col items-start justify-center gap-4'>
                {records?.map((doc) => (
                  <div className='flex flex-col md:flex-row item-center lg:items-end justify-between bg-white shadow-md w-full h-full py-6 px-4 md:px-12 rounded-md'>
                    <div className='flex flex-col md:flex-row items-center justify-start md:gap-12 gap-6'>
                      <div className='md:flex hidden'>
                        <img src={`${BASE_URL}/products/resized/${doc.image}`} alt="" className='w-24' />
                      </div>
                      <div className='md:hidden w-full flex items-end justify-between'>
                        <img src={`${BASE_URL}/products/resized/${doc.image}`} alt="" className='w-24' />
                        <div className='flex md:hidden flex-col items-end justify-center h-full mt-4 md:mt-0'>
                          <div className='flex items-center justify-center'>
                            <h2 className='text-xl'><span className='text-sm'>Sub Total : </span>₹ {doc.discountPrice * doc.quantity}</h2>
                          </div>
                          <div className='flex items-center justify-center gap-2 h-10 md:h-12'>
                            <div className='flex items-center justify-center gap-4 border border-blue-gray-700 rounded h-full'>
                              <button disabled={doc.quantity === 1} className={`${doc.quantity === 1 && "opacity-30"} h-full w-10 flex items-center justify-center cursor-pointer bg-blue-50`} onClick={() => {
                                handleQuantity(doc.productId, doc.varientId, -1);
                              }}>
                                <span className='text-lg md:text-xl font-semibold'>-</span>
                              </button>
                              <span>{doc.quantity}</span>
                              <button className=' h-full w-10 flex items-center justify-center cursor-pointer bg-blue-50' onClick={() => {
                                handleQuantity(doc.productId, doc.varientId, +1);
                              }}>
                                <span className='text-lg md:text-xl font-semibold'>+</span>
                              </button>
                            </div>
                            <div onClick={() => {
                              setDeleteId(doc.varientId)
                              handleDialogOpen();
                            }} className='flex items-center justify-center border border-blue-gray-700 rounded px-4 h-full'>
                              <img src="/icons/bin.png" alt="" className='w-6 md:h-6' />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col items-start justify-between w-full'>
                        <div className='flex flex-col items-start'>
                          <h2 className='font-semibold text-lg md:text-xl'>{doc.name}</h2>
                          <h2 className='font-semibold text-lg md:text-xl'>₹.{doc.discountPrice} <span className='font-normal line-through opacity-40'>₹.{doc.price}</span></h2>
                        </div>
                        <div className='flex flex-row md:flex-col items-start gap-2 text-blue-gray-700 text-sm'>
                          {/* <h2>{doc.quantity < doc}</h2> */}
                          <div className='flex items-center justify-start gap-4'>
                            <div className={`flex items-center justify-center gap-4 bg-white px-2 py-1 border border-blue-gray-500 cursor-pointer`}>
                              <h2 className='font-semibold'>Color </h2> <div className='block w-4 h-4 rounded-full' style={{ backgroundColor: doc.attributes?.color }}></div>
                            </div>
                          </div>
                          <div className='flex items-center justify-start gap-4'>
                            <div className={`bg-white px-2 py-1 border  border-blue-gray-500 cursor-pointer`}>
                              <h2 className='font-semibold'>{doc.attributes.ramAndRom}</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='hidden md:flex flex-col items-end justify-center h-full mt-4 md:mt-0'>
                      <div className='flex items-center justify-center'>
                        <h2 className='text-xl'><span className='text-sm'>Sub Total : </span>₹ {doc.discountPrice * doc.quantity}</h2>
                      </div>
                      <div className='flex items-center justify-center gap-2 h-12'>
                        <div className='flex items-center justify-center gap-4 border border-blue-gray-700 rounded h-full'>
                          <button disabled={doc.quantity === 1} className={`${doc.quantity === 1 && "opacity-30"} h-full w-12 flex items-center justify-center cursor-pointer bg-blue-50`} onClick={() => {
                            handleQuantity(doc.productId, doc.varientId, -1);
                          }}>
                            <span className='text-lg md:text-xl font-semibold'>-</span>
                          </button>
                          <span>{doc.quantity}</span>
                          <button className=' h-full w-12 flex items-center justify-center cursor-pointer bg-blue-50' onClick={() => {
                            handleQuantity(doc.productId, doc.varientId, +1);
                          }}>
                            <span className='text-lg md:text-xl font-semibold'>+</span>
                          </button>
                        </div>
                        <div onClick={() => {
                          setDeleteId(doc.varientId)
                          handleDialogOpen();
                        }} className='flex items-center justify-center border border-blue-gray-700 rounded px-4 h-full'>
                          <img src="/icons/bin.png" alt="" className='w-6 md:h-6' />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='w-full flex items-center justify-end py-2 pe-4'>
                  <Pagination next={next} prev={prev} total={totalCartPage} active={activePage} />
                </div>
              </div>
              <div className='w-full lg:w-4/12 min-h-[20rem] py-6 px-10 shadow-md rounded-md bg-white'>
                <div className='flex flex-col items-start justify-center w-full gap-2'>
                  <h2 className='text-xl font-semibold'>Order Summary</h2>
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
                    <span>₹ {cart?.couponApplied || 0}</span>
                  </div>
                  <div className='w-full mt-4 border-t pt-4 border-gray-800 flex items-center justify-between'>
                    <span>Total</span>
                    <span>₹ {cart?.totalPrice}</span>
                  </div>
                  <div className='w-full flex items-center justify-between'>
                    <span>Estimated delivery by</span>
                    <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className='mt-4 w-full flex flex-col gap-1 items-start justify-center'>
                    {couponStatus === 'applied' && <><h2 className='tex-xs font-medium text-green-800'>Coupon applied successfully</h2> <Button onClick={handleCouponRemoveDialog} className='tex-xs font-normal flex items-center justify-center px-3 py-1' size='sm' variant='gradient' color='yellow'>Remove Coupon</Button></>}
                    {(couponStatus === "not_applied" || couponStatus === "error") && (<>
                      <div className='mt-4 w-full h-12 flex items-center border border-gray-800 justify-between'>
                        <input type="text" value={couponCode} onChange={(event) => {
                          setCouponCode(event.target.value);
                        }} placeholder='Coupon Code' className='outline-none w-10/12 h-full ps-4' />
                        <button onClick={handleApplyCoupon} className='w-2/12 h-full bg-black flex items-center justify-center'>
                          <img src="/icons/tick-white-trsp.png" alt="" className='w-6' />
                        </button>
                      </div>
                    </>)}
                    {couponStatus === "error" && (<><h2 className='tex-xs font-medium text-red-400'>{couponError}</h2></>)}
                  </div>
                  <div className='w-full flex items-center justify-between mt-4'>
                    {user?.verified ? (
                      <Button onClick={() => navigate('/checkout')} variant='filled' className='w-full items-center justify-center py-4'>Proceed to checkout</Button>
                    ) : (
                      <Button onClick={() => navigate('/profile/account?verify_request=true')} variant='filled' className='w-full items-center justify-center py-4'>Proceed to checkout</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <DeleteCartProduct userId={user?._id} open={dialogOpen} handleOpen={handleDialogOpen} deleteId={deleteId} setDeleteId={setDeleteId} openCouponRemoveDialog={handleCouponRemoveDialog} />
      <RemoveCouponFromCart open={couponRemoveDialog} handleOpen={handleCouponRemoveDialog} userId={user?._id} cartId={cart?._id} handleCouponStatus={handleCouponStatus} />
    </>
  )
}

export default Cart