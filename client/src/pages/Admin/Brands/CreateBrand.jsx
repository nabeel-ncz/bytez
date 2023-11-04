import React, { useState } from 'react'
import { Breadcrumbs, Button } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addNewBrand } from '../../../store/actions/admin/adminActions';
import toast from 'react-hot-toast';


function CreateBrand() {
    const [brand, setBrand] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) => {
        setBrand(event.target.value);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        dispatch(addNewBrand({brand})).then((response) => {
            if(response?.payload?.status === "ok" ){
                toast.success("Category created successfully!");
                setCategory('');
            }else{
                toast.error("There is something went wrong!");
            }
        })
    };
    return (
        <>
            <div className="p-5 w-full overflow-y-auto">
                <div className="flex justify-between items-center text-xs font-semibold">
                    <div>
                        <h1 className="font-bold text-2xl">Create Brand</h1>
                        <Breadcrumbs>
                        <Link to={"/admin"} className="opacity-60">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" >
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </Link>
                        <Link to={"/admin/brands"}>
                            Brands
                        </Link>
                        <Link to={"/admin/brands/create"}>
                            Create Brand
                        </Link>
                    </Breadcrumbs>
                    </div>
                    <div className="flex gap-3">
                    </div>
                </div>
                <div className="overflow-x-scroll lg:overflow-hidden flex items-start">
                    <form onSubmit={handleFormSubmit} className='mt-6 flex flex-col items-start gap-0'>
                        <label >Brand Name : </label>
                        <input onChange={handleChange} value={brand} className='w-60 h-12 bg-white rounded border border-gray-700 outline-none' />
                        <Button type='submit' variant='gradient' className='w-full py-2 mt-4'>Save</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateBrand