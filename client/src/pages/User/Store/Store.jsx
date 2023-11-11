import React, { useEffect } from 'react'
import RowPost from '../../../components/RowPost/RowPost'
import ProductCard from '../../../components/ProductCard/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreProducts } from '../../../store/actions/products/productsAction';

function Store() {
    const products = useSelector(state => state.products?.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStoreProducts());
    },[])

    return (
        <div className='w-full min-h-screen py-6 px-24 flex items-start justify-between gap-8'>
            <div className='w-2/12 h-[600px] bg-white rounded shadow-lg py-4 px-2 flex'>
                <h2> </h2>
            </div>
            {console.log(products)}
            <div className='w-10/12 flex flex-col items-start justify-center gap-2'>
                <div className='w-full h-16 bg-white rounded shadow-lg py-4 px-2'>
                    <h2> </h2>
                </div>
                <div className='w-full flex items-start justify-start flex-wrap my-2 gap-4'>
                    {products?.map((doc) => (
                        <ProductCard id={doc._id} image={doc?.varients[0]?.images?.mainImage} title={doc?.title}
                        description={doc?.varients[0]?.description} price={doc.varients[0]?.price} varients={doc?.varients}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Store