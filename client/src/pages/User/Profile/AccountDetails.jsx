import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

function AccountDetails() {
    const navigate = useNavigate();
    return (
        <div className='w-9/12 shadow-sm bg-white'>
            <Formik
                initialValues={{
                    firstname: "Muhammed",
                    lastname:"Nabeel",
                    email:"nabeelnabhan@gmail.com",
                    phone:"7558963319"
                }}
            >
                <Form>
                    <div className='w-full flex flex-col items-start justify-center py-6 font-medium text-sm gap-4'>
                        <div className='w-full flex items-center justify-between border-b border-gray-400 px-12 pb-2'>
                            <h2 className='text-start font-medium text-sm'>Account Details</h2>
                            <div><img src="/icons/edit-icon.png" alt="" className='w-6' /></div>
                        </div>
                        <div className='w-full flex gap-6 px-12'>
                            <div className='w-1/2'>
                                <div className='flex flex-col items-start justify-center'>
                                    <h6>First Name</h6>
                                    <Field type="text" name="firstname" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="firstname" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                            </div>
                            <div className='w-1/2'>
                                <div className='flex flex-col items-start justify-center'>
                                    <h6>Last Name</h6>
                                    <Field type="text" name="lastname" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="lastname" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex gap-6 px-12'>
                            <div className='w-1/2'>
                                <div className='flex flex-col items-start justify-center'>
                                    <h6>Email</h6>
                                    <Field type="text" name="email" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                            </div>
                            <div className='w-1/2'>
                                <div className='flex flex-col items-start justify-center'>
                                    <h6>Phone</h6>
                                    <Field type="text" name="phone" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex gap-6 px-12'>
                            <div className='w-1/2'>
                            </div>
                            <div className='w-1/2'>
                                <div onClick={() => {navigate('change_password')}} className='flex items-center justify-between px-4 py-2 bg-white border-2 border-gray-400'>
                                    <h2>Change Password</h2>
                                    <img src="/icons/edit-icon.png" alt="" className='w-6' />
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default AccountDetails