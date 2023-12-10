import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from "@material-tailwind/react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUserInform } from '../../../store/actions/user/userActions';
import toast from 'react-hot-toast';

function AccountDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user?.user?.data);
    const [searchQuery, setSearchQuery] = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        let showToast = searchQuery.get('verify_request');
        if (showToast) {
            toast('Please verify your account first!', { icon: '✔️' });
        }
    }, []);

    const handleEditButton = () => {
        setIsEditMode(true);
    }
    const handleEditCancel = (resetForm) => {
        setIsEditMode(false);
        resetForm();
    }

    const handleFormSubmit = (formikProps) => {
        const values = formikProps.values;
        if (!values.firstName || !values.lastName) {
            toast.error('First Name and Last Name is required!');
            return;
        }
        console.log(values, 'not working')
        dispatch(updateUserInform({ userId: user?._id, ...values })).then((response) => {
            if (response?.payload?.status === "ok") {
                dispatch(fetchUser());
            }
        }).finally(() => {
            setIsEditMode(false);
        })
    }

    const handleEmailChange = () => {
        toast.error("you cant't change the email!");
    }

    return (
        <div className='w-full lg:w-9/12 shadow-sm bg-white'>
            <Formik
                initialValues={{
                    firstName: user?.name?.split(' ')[0],
                    lastName: user?.name?.split(' ')[1],
                    email: user?.email,
                    phone: user?.phone
                }}
            >
                {(formikProps) => (
                    <Form>
                        <div className='w-full flex flex-col items-start justify-center py-6 font-medium text-sm gap-4'>
                            <div className='w-full flex items-center justify-between border-b border-gray-400 px-12 pb-2'>
                                <h2 className='text-start font-medium text-sm'>Account Details</h2>
                                {!isEditMode && (<div onClick={handleEditButton}><img src="/icons/edit-icon.png" alt="" className='w-6' /></div>)}
                            </div>
                            <div className='w-full flex gap-6 px-12'>
                                <div className='w-1/2'>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h6>First Name</h6>
                                        <Field type="text" name="firstName" readOnly={!isEditMode} className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                                <div className='w-1/2'>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h6>Last Name</h6>
                                        <Field type="text" name="lastName" readOnly={!isEditMode} className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex gap-6 px-12'>
                                <div className='w-1/2'>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h6>Email</h6>
                                        <Field type="text" name="email" readOnly={true} onClick={handleEmailChange} className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                                <div className='w-1/2'>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h6>Phone</h6>
                                        <Field type="text" name="phone" readOnly={!isEditMode} className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                            </div>
                            {isEditMode && (
                                <div className='w-full flex gap-6 px-12'>
                                    <div className='w-1/2'>
                                    </div>
                                    <div className='w-1/2 flex items-center justify-center gap-2'>
                                        <Button type='button' onClick={() => { handleEditCancel(formikProps.resetForm) }} className='w-1/3' variant='outlined'>Cancel</Button>
                                        <Button onClick={() => { handleFormSubmit(formikProps) }} className='w-2/3'>Save Changes</Button>
                                    </div>
                                </div>
                            )}
                            {!user.oauth && (
                                <div className='w-full flex flex-col lg:flex-row gap-6 px-12'>
                                    <div className='w-full lg:w-1/2'>

                                    </div>
                                    <div className='w-full lg:w-1/2 flex items-center justify-between gap-2'>
                                        {!user?.verified && (
                                            <div onClick={() => { navigate(`/verify/email?request=true&email=${user?.email}`) }} className='w-full h-full flex items-center justify-between px-4 py-2 bg-white border-2 border-green-200 cursor-pointer'>
                                                <h2 className='text-xs xl:text-base'>Verify Account</h2>
                                                <img src="/icons/edit-icon.png" alt="" className='w-6 opacity-0' />
                                            </div>
                                        )}
                                        <div onClick={() => { navigate('change_password') }} className='w-full flex items-center justify-between px-4 py-2 bg-white border-2 border-gray-400'>
                                            <h2 className='text-xs xl:text-base'>Change Password</h2>
                                            <img src="/icons/edit-icon.png" alt="" className='w-6' />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AccountDetails;