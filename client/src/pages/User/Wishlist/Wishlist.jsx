import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlistItemsDetails, removeItemFromWishlist } from '../../../store/actions/user/userActions';
import axios from 'axios';
import Pagination from '../../../components/Pagination/Pagination';

function Wishlist() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.user?.data);
  const wishlist = useSelector(state => state.user?.wishlist?.data);
  const [data, setData] = useState(null);

  useEffect(() => {
    dispatch(getWishlistItemsDetails(user?._id)).then((response) => {
      if (response?.payload?.status === "ok") {
        setData(response.payload?.data?.items);
      }
    })
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

      <div className='w-full flex items-start justify-center gap-2 py-2 lg:py-6 px-4 lg:px-24'>
        <div className='w-full flex flex-col items-start justify-center gap-4'>
          {data?.map((doc) => (
            <div className='flex items-end justify-between bg-white shadow-md w-full h-full py-6 px-12 rounded-md'>
              <div className='w-full flex flex-col sm:flex-row items-center justify-start gap-12'>
                <div className='w-full sm:w-4/12 lg:w-2/12 flex flex-col items-center justify-center p-1 lg:p-6 gap-2'>
                  <img src={`http://localhost:3000/products/resized/${doc.varients[0].images.mainImage}`} alt="" className='w-fit' />
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
              <div className='flex flex-col items-end justify-center h-full'>
                <div className='w-14 flex items-center justify-center gap-2 h-12'>
                  <div onClick={() => { handleRemoveItem(doc._id) }} className='flex items-center justify-center border border-red-100 hover:border-red-400 cursor-pointer rounded px-4 h-full'>
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
  )
}

export default Wishlist