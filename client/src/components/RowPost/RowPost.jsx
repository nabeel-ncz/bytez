import React, { useEffect, useState } from 'react'
import ProductCard from '../ProductCard/ProductCard'
import Dummy from '../ProductCard/Dummy'
import { useDispatch } from 'react-redux';
import { getProductsByBrand } from '../../store/actions/products/productsAction';

function RowPost({ title }) {
  const dispatch = useDispatch();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    if (title) {
      dispatch(getProductsByBrand(title)).then((response) => {
        setProducts(response?.payload?.data || null);
      });
    }
  }, [title]);

  return (
    <>
      {products?.length >= 5 && (
        <>
          <div className='w-full pb-6 px-6 lg:px-32 flex items-center justify-between'>
            <h2 className='underline text-lg font-semibold'>{title}</h2>
            {/* <div className='flex items-center justify-center gap-2'>
              <img src="/icons/arrow-icon.png" alt="" className='w-6 h-6 rotate-90' />
              <img src="/icons/arrow-icon.png" alt="" className='w-6 h-6 -rotate-90' />
            </div> */}
          </div>
          <div className='w-full pb-12 px-6 lg:px-32 gap-2 lg:gap-0 flex flex-row items-center justify-between overflow-x-auto lg:overflow-x-hidden'>
            {products?.splice(0, 5)?.map((doc) => (
              <ProductCard id={doc._id} image={doc?.varients[0]?.images?.mainImage} title={doc?.title}
                description={doc?.varients[0]?.description} price={doc.varients[0]?.discountPrice} varients={doc?.varients} />
            ))}
          </div>
        </>
      )}

    </>
  )
}

export default RowPost