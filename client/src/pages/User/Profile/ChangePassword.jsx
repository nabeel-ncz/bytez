import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

function ChangePassword() {
    return (
        <>
            <div className='w-9/12 shadow-sm bg-white'>
                <Formik>
                    <Form>
                        <div className='w-full flex flex-col items-start justify-center py-6 font-medium text-sm gap-4'>
                            <div className='w-full flex items-center justify-between border-b border-gray-400 px-12 pb-2'>
                                <h2 className='text-start font-medium text-sm'>Change Password</h2>
                            </div>
                            <div className='w-full flex gap-6 px-12'>
                                <div className='w-1/2'>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h6>Current Password</h6>
                                        <Field type="text" name="current_password" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="current_password" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                                <div className='w-1/2'>
                                    
                                </div>
                            </div>
                            <div className='w-full flex gap-6 px-12'>
                                <div className='w-1/2'>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h6>New Password</h6>
                                        <Field type="text" name="new_password" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="new_password" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                                <div className='w-1/2'>
                                    
                                </div>
                            </div>
                            
                            <div className='w-full flex gap-6 px-12'>
                                <div className='w-1/2'>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h6>Confirm Password</h6>
                                        <Field type="text" name="confirm_password" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                                <div className='w-1/2'>
                                    
                                </div>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}

export default ChangePassword