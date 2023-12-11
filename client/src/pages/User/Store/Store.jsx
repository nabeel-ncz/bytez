import React, { useEffect, useState } from 'react'
import ProductCard from '../../../components/ProductCard/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreProducts } from '../../../store/actions/products/productsAction';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
    Drawer,
    Button,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import ProductCardSm from '../../../components/ProductCard/ProductCardSm';
import { IoFilterSharp } from "react-icons/io5";
import { getAllWishlistItems } from '../../../store/actions/user/userActions';
import { getActiveBrandsApi, getActiveCategoriesApi } from '../../../services/api';
import PageLoading from '../../../components/Loading/PageLoading';

function Store() {
    const products = useSelector(state => state.products?.data);
    const productsLoading = useSelector(state => state.products?.loading);
    const user = useSelector(state => state.user?.user?.data);
    const [filterQueries, setFilterQueries] = useState({
        search: "all", category: "all", brand: "all", availability: "all", priceFrom: 0, priceTo: Number.MAX_SAFE_INTEGER, rating: "all"
    });
    const [query, setQuery] = useSearchParams();
    const queryParam = new URLSearchParams();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState(null);
    const [brands, setBrands] = useState(null);
    const [page, setPage] = useState(1);
    const [open, setOpen] = React.useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    useEffect(() => {
        console.log(filterQueries)
        setFilterQueries(state => ({ ...state, search: query.get('search') ?? "all" }));
        const search = query.get('search');
        const category = query.get('category');
        const brand = query.get('brand');
        const availability = query.get('availability');
        const priceFrom = query.get('priceFrom');
        const priceTo = query.get('priceTo');
        const rating = query.get('rating');

        dispatch(getStoreProducts({ search, category, brand, availability, priceFrom, priceTo, rating, page }));
        dispatch(getAllWishlistItems(user?._id));
    }, [query, page]);

    useEffect(() => {
        getActiveCategoriesApi().then((response) => {
            if (response.data?.status === "ok") {
                setCategories(response?.data?.data);
            }
        });
        getActiveBrandsApi().then((response) => {
            if (response.data?.status === "ok") {
                setBrands(response?.data?.data);
            }
        });
    }, [])

    const handleFilter = (event) => {
        setFilterQueries(state => {
            const updatedState = {
                ...state,
                [event.target.name]: event.target.value,
            };
            Object.keys(updatedState).forEach((key) => {
                queryParam.append(key, updatedState[key]);
            });
            setQuery(queryParam);
            return updatedState;
        });
    }

    const handleLoadMore = () => {
        setPage(state => state + 1);
    }

    return (
        <>
            {productsLoading ? <PageLoading /> : (
                <div className='w-screen min-h-[86vh] px-6 lg:px-24 flex items-start justify-between gap-8'>
                    <>
                        <div className='w-2/12 h-[600px] bg-white rounded shadow-lg pt-2 pb-4 px-4 hidden lg:flex flex-col items-start justify-start'>
                            <h2 className='font-medium text-lg'>Filter by</h2>
                            <div className='w-full flex flex-col items-start justify-center mt-2 gap-2'>
                                <h2 className='font-semibold text-sm text-gray-800'>Category</h2>
                                <select onChange={handleFilter} name="category" id="" value={filterQueries.category} className='w-full bg-blue-gray-50 px-2 py-2 text-sm'>
                                    <option value="all">All</option>
                                    {categories?.map((item) => (
                                        <option value={item?.category}>{item.category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                                <h2 className='font-semibold text-sm text-gray-800'>Availability</h2>
                                <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                                    <input type="radio" name='availability' value="all" onChange={handleFilter} />
                                    <span className='font-base text-sm'>All</span>
                                </label>
                                <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                                    <input type="radio" name='availability' value="instock" onChange={handleFilter} />
                                    <span className='font-base text-sm'>In Stock</span>
                                </label>
                                <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                                    <input type="radio" name='availability' value="outofstock" onChange={handleFilter} />
                                    <span className='font-base text-sm'>Out Of Stock</span>
                                </label>
                            </div>
                            <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                                <h2 className='font-semibold text-sm text-gray-800'>Brand</h2>
                                <select name="brand" id="" value={filterQueries.brand} onChange={handleFilter} className='w-full bg-blue-gray-50 px-2 py-2 text-sm'>
                                    <option value="all">All</option>
                                    {brands?.map((item) => (
                                        <option value={item.brand}>{item.brand}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                                <h2 className='font-semibold text-sm text-gray-800'>Price</h2>
                                <div className='w-full flex items-center justify-between gap-2 text-sm'>
                                    <div className='w-1/2 flex items-center justify-start gap-2 bg-blue-gray-50 p-2'>
                                        <span>₹</span>
                                        <input value={filterQueries.priceFrom === 0 ? "" : filterQueries.priceFrom} onChange={(event) => {
                                            setFilterQueries(state => ({ ...state, priceFrom: event.target.value }))
                                        }} type="number" onBlur={handleFilter} name='priceFrom' className='w-full bg-transparent outline-none' placeholder='from' />
                                    </div>
                                    <div className='w-1/2 flex items-center justify-start gap-2 bg-blue-gray-50 p-2'>
                                        <span>₹</span>
                                        <input value={filterQueries.priceTo === Number.MAX_SAFE_INTEGER ? "" : filterQueries.priceTo} onChange={(event) => {
                                            setFilterQueries(state => ({ ...state, priceTo: event.target.value }))
                                        }} type="number" onBlur={handleFilter} name='priceTo' className='w-full bg-transparent outline-none' placeholder='to' />
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                                <h2 className='font-semibold text-sm text-gray-800'>Rating</h2>
                                <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                                    <input type="radio" name='rating' value={"all"} onChange={handleFilter} />
                                    <span className='font-base text-sm'>All</span>
                                </label>
                                <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                                    <input type="radio" name='rating' value={"4"} onChange={handleFilter} />
                                    <span className='font-base text-sm'>4★ & Above</span>
                                </label>
                                <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                                    <input type="radio" name='rating' value={"3"} onChange={handleFilter} />
                                    <span className='font-base text-sm'>3★ & Above</span>
                                </label>
                                <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                                    <input type="radio" name='rating' value={"2"} onChange={handleFilter} />
                                    <span className='font-base text-sm'>2★ & Above</span>
                                </label>
                            </div>
                        </div>
                    </>
                    {console.log(products)}
                    <div className='w-12/12 lg:w-10/12 flex flex-col items-start justify-center gap-2'>
                        <div className='w-full h-16 bg-white rounded shadow-lg py-2 px-2 flex items-center justify-end'>
                            <Button className='flex lg:hidden items-center justify-center gap-2' variant='outlined' size='sm' onClick={openDrawer}><span className='text-sm'>Filter</span><IoFilterSharp size={'20px'} /></Button>
                        </div>
                        <div className='w-full lg:hidden max-h-[74vh] overflow-y-scroll flex items-start justify-start flex-wrap my-2 gap-4 custom-scrollbar'>
                            {products?.map((doc) => (
                                <ProductCardSm id={doc._id} image={doc?.varients[0]?.images?.mainImage} title={doc?.title}
                                    description={doc?.varients[0]?.description} price={doc.varients[0]?.discountPrice} varients={doc?.varients} rating={doc?.totalRating} />
                            ))}
                            <div className='w-full py-4 pe-8 flex items-center justify-center'>
                                <Button onClick={handleLoadMore} variant='outlined' size='sm'>Load More</Button>
                            </div>
                        </div>
                        <div className='w-full max-h-[74vh] overflow-y-scroll hidden lg:flex items-start justify-start flex-wrap my-2 gap-10 custom-scrollbar'>
                            {products?.map((doc) => (
                                <ProductCard id={doc._id} image={doc?.varients[0]?.images?.mainImage} title={doc?.title}
                                    description={doc?.varients[0]?.description} price={doc.varients[0]?.discountPrice} varients={doc?.varients} rating={doc?.totalRating} />
                            ))}
                            <div className='w-full py-4 pe-8 flex items-center justify-center'>
                                <Button onClick={handleLoadMore} variant='outlined' size='sm'>Load More</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Drawer open={open} onClose={closeDrawer} className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray">
                        Filter By
                    </Typography>
                    <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </div>
                <div className='w-full flex flex-col items-start justify-center mt-2 gap-2'>
                    <h2 className='font-semibold text-sm text-gray-800'>Category</h2>
                    <select onChange={handleFilter} name="category" id="" value={filterQueries.category} className='w-full bg-blue-gray-50 px-2 py-2 text-sm'>
                        <option value="all">All</option>
                        {categories?.map((item) => (
                            <option value={item?.category}>{item.category}</option>
                        ))}
                    </select>
                </div>
                <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                    <h2 className='font-semibold text-sm text-gray-800'>Availability</h2>
                    <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                        <input type="radio" name='availability' value="all" onChange={handleFilter} />
                        <span className='font-base text-sm'>All</span>
                    </label>
                    <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                        <input type="radio" name='availability' value="instock" onChange={handleFilter} />
                        <span className='font-base text-sm'>In Stock</span>
                    </label>
                    <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                        <input type="radio" name='availability' value="outofstock" onChange={handleFilter} />
                        <span className='font-base text-sm'>Out Of Stock</span>
                    </label>
                </div>
                <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                    <h2 className='font-semibold text-sm text-gray-800'>Brand</h2>
                    <select name="brand" id="" value={filterQueries.brand} onChange={handleFilter} className='w-full bg-blue-gray-50 px-2 py-2 text-sm'>
                        <option value="all">All</option>
                        {brands?.map((item) => (
                            <option value={item.brand}>{item.brand}</option>
                        ))}
                    </select>
                </div>
                <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                    <h2 className='font-semibold text-sm text-gray-800'>Price</h2>
                    <div className='w-full flex items-center justify-between gap-2 text-sm'>
                        <div className='w-1/2 flex items-center justify-start gap-2 bg-blue-gray-50 p-2'>
                            <span>₹</span>
                            <input value={filterQueries.priceFrom === 0 ? "" : filterQueries.priceFrom} onChange={(event) => {
                                setFilterQueries(state => ({ ...state, priceFrom: event.target.value }))
                            }} type="number" onBlur={handleFilter} name='priceFrom' className='w-full bg-transparent outline-none' placeholder='from' />
                        </div>
                        <div className='w-1/2 flex items-center justify-start gap-2 bg-blue-gray-50 p-2'>
                            <span>₹</span>
                            <input value={filterQueries.priceTo === Number.MAX_SAFE_INTEGER ? "" : filterQueries.priceTo} onChange={(event) => {
                                setFilterQueries(state => ({ ...state, priceTo: event.target.value }))
                            }} type="number" onBlur={handleFilter} name='priceTo' className='w-full bg-transparent outline-none' placeholder='to' />
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col items-start justify-center mt-4 gap-2'>
                    <h2 className='font-semibold text-sm text-gray-800'>Rating</h2>
                    <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                        <input type="radio" name='rating' value={"all"} onChange={handleFilter} />
                        <span className='font-base text-sm'>All</span>
                    </label>
                    <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                        <input type="radio" name='rating' value={"4"} onChange={handleFilter} />
                        <span className='font-base text-sm'>4★ & Above</span>
                    </label>
                    <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                        <input type="radio" name='rating' value={"3"} onChange={handleFilter} />
                        <span className='font-base text-sm'>3★ & Above</span>
                    </label>
                    <label htmlFor="" className='flex ps-1 items-center justify-start gap-2'>
                        <input type="radio" name='rating' value={"2"} onChange={handleFilter} />
                        <span className='font-base text-sm'>2★ & Above</span>
                    </label>
                </div>
            </Drawer>

        </>
    )
}

export default Store