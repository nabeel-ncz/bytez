import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Chip } from "@material-tailwind/react";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { getCustomerDetailsApi, updateCustomerStatusApi } from '../../../services/api';

function CustomerView() {
    const [user, setUser] = useState(null);
    const [date, setDate] = useState("");
    const { id } = useParams();

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        getCustomerDetailsApi(id).then((response) => {
            if (response.data?.status === "ok") {
                setUser(response.data?.data);
                setDate(new Date(response.data?.data?.createdAt).toLocaleString());
            } else {
                setUser(null);
            }
        })
    }
    const handleUserStatus = () => {
        updateCustomerStatusApi(user?._id, user?.isBlocked).then((response) => {
            if (response.data?.status === "ok") {
                handleFetch();
            }
        })
    }
    return (
        <>
            <div className="p-5 w-full md:overflow-y-hidden">
                <div className="flex justify-between items-center text-xs font-semibold">
                    <div>
                        <h1 className="font-bold text-2xl">Customer Information</h1>
                        <Breadcrumbs>
                            <Link to={"/admin"} className="opacity-60">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                            </Link>
                            <Link to={"/admin/customers"}>
                                Customers
                            </Link>
                            <Link to={""}>
                                Detailed
                            </Link>
                        </Breadcrumbs>
                    </div>

                </div>
                <div className="lg:flex ">
                    <div className="lg:w-4/6 lg:mr-5">
                        <div className="bg-white py-5 rounded-lg mb-5 flex flex-col items-start gap-2">
                            <div className='w-full flex items-center justify-between px-5'>
                                <h1 className='font-bold'>Account Info</h1>
                                <span onClick={handleUserStatus}>
                                    <Chip
                                        variant="ghost"
                                        color={user?.isBlocked ? "red" : "green"}
                                        size="sm"
                                        value={user?.isBlocked ? "blocked" : "active"}
                                    />
                                </span>
                            </div>

                            {user &&
                                <div className="text-start w-full border-t border-blue-gray-100 px-5 flex flex-col items-start gap-2">
                                    <h2 className="font-medium mt-4">Name : {user.name}</h2>
                                    <h2 className="font-medium">Email : {user.email}</h2>
                                    <h2 className="font-medium">Phone : {user?.phone ? user?.phone : "nil"}</h2>
                                    <h2 className="font-medium">Created At : {date}</h2>
                                    <h2 className={`font-medium ${user.verified ? "text-blue-800" : "text-orange-800"}`}>Account is {user.verified ? "Verified" : "Not Verified"} </h2>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="lg:w-2/6">
                        {/* <div className="bg-white p-5 rounded-lg mb-5 text-start flex flex-col gap-2">
                            <div className="text-start w-full px-5 flex items-center justify-start gap-4 bg-blue-100 py-4">
                                <div className='w-fit bg-white p-2'>
                                    <img src="/icons/rocket-icon.png" alt="" className='w-10' />
                                </div>
                                <div className='text-start'>
                                    <h1 className='font-bold'>154</h1>
                                    <h6 className='font-normal'>Total Orders</h6>
                                </div>
                            </div>
                            <div className="text-start w-full px-5 flex items-center justify-start gap-4 bg-orange-100 py-4">
                                <div className='w-fit bg-white p-2'>
                                    <img src="/icons/receipt-icon.png" alt="" className='w-10' />
                                </div>
                                <div className='text-start'>
                                    <h1 className='font-bold'>14</h1>
                                    <h6 className='font-normal'>Pending Orders</h6>
                                </div>
                            </div>
                            <div className="text-start w-full px-5 flex items-center justify-start gap-4 bg-green-100 py-4">
                                <div className='w-fit bg-white p-2'>
                                    <img src="/icons/package-icon.png" alt="" className='w-10' />
                                </div>
                                <div className='text-start'>
                                    <h1 className='font-bold'>28</h1>
                                    <h6 className='font-normal'>Completed Orders</h6>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerView;