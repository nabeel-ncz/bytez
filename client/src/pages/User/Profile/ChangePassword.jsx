import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import resetPasswordSchema from '../../../schema/user/resetPasswordSchema';
import { Button } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserPassword } from '../../../store/actions/user/userActions';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ChangePassword() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user?.user?.data);
    const navigate = useNavigate();

    const handleFormSubmit = (values) => {
        dispatch(updateUserPassword({
            userId: user?._id,
            current_password: values.current_password,
            new_password: values.new_password,
        })).then((response) => {
            if(response.payload?.status === 'ok'){
                navigate('/profile/account')
            } else if(response.payload?.status === 'error'){
                toast.error(response.payload?.message);
            } else {
                toast.error(response.error?.message);
            }
        })
    }
    return (
        <>
            <div className='w-full lg:w-9/12 shadow-sm bg-white'>
                <Formik
                initialValues={{
                    current_password:"",
                    new_password:"",
                    confirm_password:""
                }}
                validationSchema={resetPasswordSchema}
                onSubmit={(values) => {handleFormSubmit(values)}}
                >
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
                            <div className='w-full flex gap-6 px-12'>
                                <div className='w-1/2 flex justify-start'>
                                    <Button type='submit' className="w-1/2">Submit</Button>
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