import React, { useState } from 'react'
import { Breadcrumbs, Button } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addNewBrand } from '../../../store/actions/admin/adminActions';
import toast from 'react-hot-toast';
import CustomFileInput from '../../../components/CustomFileInput/CustomFileInput';


function CreateBrand() {
    const [data, setData] = useState({
        brand: "", status: "active"
    });
    const [thumbnail, setThumbnail] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) => {
        setData((state) => ({
            ...state,
            [event.target.name]: event.target.value,
        }))
    };

    const handleThumbnail = (file) => {
        setThumbnail(file);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if(!thumbnail){
            toast.error("Thumbnail is required!");
            return;
        }
        dispatch(addNewBrand({ brand: data?.brand, file: thumbnail, status: data?.status })).then((response) => {
            if (response?.payload?.status === "ok") {
                toast.success("Brand created successfully!");
                setData({brand:"", status:""});
                navigate('/admin/brands')
            } else {
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
                        <input onChange={handleChange} name='brand' value={data?.brand} required className='w-60 h-12 bg-white rounded border border-gray-700 outline-none' />
                        <label htmlFor="">Thumbnail : </label>
                        <CustomFileInput onChange={handleThumbnail} />
                        <label >Status : </label>
                        <label htmlFor="">
                            <input type="radio" name='status' value={"active"} checked={data?.status === "active"} onChange={handleChange} />
                            Active
                        </label>
                        <label htmlFor="">
                            <input type="radio" name='status' value={"block"} checked={data?.status === "block"} onChange={handleChange} />
                            Block
                        </label>
                        <Button type='submit' variant='gradient' className='w-full py-2 mt-4'>Save</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateBrand