import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlistItemsDetails, removeItemFromWishlist } from '../../../store/actions/user/userActions';
import axios from 'axios';
import Pagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../constants/urls';
import PageLoading from '../../../components/Loading/PageLoading';

function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user?.user?.data);
  const wishlist = useSelector(state => state.user?.wishlist?.data);
  const userLoading = useSelector(state => state.user?.user?.loading);
  const [data, setData] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false)

  useEffect(() => {
    setItemsLoading(true);
    dispatch(getWishlistItemsDetails(user?._id)).then((response) => {
      if (response?.payload?.status === "ok") {
        setData(response.payload?.data?.items);
      }
    }).finally(() => {
      setItemsLoading(false);
    });
  }, []);

  const getStorageVarients = (varients) => {
    return Array.from([...new Set(varients.map(item => item.ramAndRom))]);
  }
  const getColorVarients = (varients) => {
    return Array.from([...new Set(varients.map(item => item.color))]);
  }

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromWishlist({
      userId: user?._id,
      productId: id,
    })).then(() => {
      dispatch(getWishlistItemsDetails(user?._id)).then((response) => {
        if (response?.payload?.status === "ok") {
          setData(response.payload?.data?.items);
        }
      });
    });
  };

  return (
    <>
      {(userLoading || itemsLoading) ? <PageLoading /> : (
        <>
          {(!data || data?.length === 0) && (<h2 className='text-center w-full mt-4'>Wishlist is empty!</h2>)}
          <div className='w-full min-h-[60vh] flex items-start justify-center gap-2 py-2 lg:py-6 px-4 lg:px-24'>
            <div className='w-full flex flex-col items-start justify-center gap-4'>
              {data?.map((doc) => (
                <div className='flex flex-col md:flex-row items-end justify-between bg-white shadow-md w-full h-full py-6 px-12 rounded-md'>
                  <div className='w-full flex flex-col sm:flex-row items-center justify-start gap-12'>
                    <div className='w-full sm:w-4/12 lg:w-2/12 flex flex-col items-center justify-center p-12 sm:p-2 md:p-0 gap-2'>
                      <img src={`${BASE_URL}/products/resized/${doc.varients[0].images.mainImage}`} alt="" className='object-cover' />
                      <span className='text-xs'>+{doc.varients?.length} More variants</span>
                    </div>
                    <div className='w-full sm:w-8/12 lg:w-10/12 flex flex-col items-start justify-between'>
                      <h2 className='font-semibold text-xl'>{doc.title}</h2>
                      <p className='font-light text-xs text-start line-clamp-2'>{doc.varients[0].description}</p>
                      <h2 className='font-semibold text-xl my-1'>₹.{doc.varients[0].discountPrice} <span className='font-normal line-through opacity-40'>₹.{doc.varients[0].price}</span></h2>
                      <div className='flex flex-col items-start gap-2 text-blue-gray-700 text-sm'>
                        <div className='flex items-center justify-start gap-4'>
                          <div className={`flex items-center justify-center gap-4 bg-white px-2 py-1 border border-blue-gray-500 cursor-pointer`}>
                            <h2 className='font-semibold'>Colors : </h2>
                            {getColorVarients(doc.varients)?.map((color) => (
                              <div className='block w-4 h-4 rounded-full' style={{ backgroundColor: color }}></div>
                            ))}
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row items-center justify-start gap-4'>
                          {getStorageVarients(doc.varients)?.map((item) => (
                            <div className={`bg-white px-2 py-1 border  border-blue-gray-500 cursor-pointer`}>
                              <h2 className='font-semibold'>{item}</h2>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='w-full h-full mt-2 sm:mt-0'>
                    <div className='w-full flex items-center justify-start sm:justify-center gap-2 h-12'>
                      <div onClick={() => {
                        navigate(`/product/${doc?._id}?sv=true`);
                      }} className='w-36 flex items-center justify-center border border-gray-300 hover:border-gray-900 cursor-pointer rounded px-4 h-full'>
                        <span>Add to cart</span>
                      </div>
                      <div onClick={() => { handleRemoveItem(doc._id) }} className='w-14 flex items-center justify-center border border-red-100 hover:border-red-400 cursor-pointer rounded px-4 h-full'>
                        <img src="/icons/bin.png" alt="" className='w-full' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className='w-full flex items-center justify-end py-2 pe-4'>
                {/* <Pagination next={next} prev={prev} total={totalCartPage} active={activePage} /> */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Wishlist