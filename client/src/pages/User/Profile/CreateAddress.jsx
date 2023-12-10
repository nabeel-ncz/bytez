import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import addressSchema from '../../../schema/user/addressSchema';
import { useDispatch, useSelector } from 'react-redux';
import { createAddress } from '../../../store/actions/user/userActions';
import { useSearchParams } from 'react-router-dom';

function CreateAddress() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state?.user?.user?.data);
    const [searchQuery, setSearchQuery] = useSearchParams();

    const isFromOrders = searchQuery.get('from_orders');

    const handleFormSubmit = (values) => {
        dispatch(createAddress({
            userId: user._id,
            ...values
        })).then(() => {
            if(isFromOrders){
                navigate('/checkout');
            } else {
                navigate('/profile/address');
            }
        })
    }
    return (
        <>
            <div className='w-full lg:w-9/12 shadow-sm bg-white'>
                <Formik
                    initialValues={{
                        firstName:"",
                        lastName:"",
                        email:"",
                        phone:"",
                        companyName:"",
                        houseAddress:"",
                        country:"",
                        state:"",
                        city:"",
                        zipcode:"",
                    }}
                    validationSchema={addressSchema}
                    onSubmit={handleFormSubmit}
                >
                    <Form>
                        <div className='w-full flex flex-col items-start justify-center py-6 font-medium text-sm gap-4'>
                            <div className='w-full flex items-center justify-between border-b border-gray-400 px-12 pb-2'>
                                <h2 className='text-start font-medium text-sm'>Account Details</h2>
                                <div><img src="/icons/edit-icon.png" alt="" className='w-6' /></div>
                            </div>
                            <div className='w-full flex gap-2 px-12'>
                                <div className='w-3/6 flex flex-col items-start'>
                                    <h6>Name</h6>
                                    <div className='w-full flex items-center justify-center gap-2'>
                                        <div className='w-1/2 flex flex-col items-start justify-center'>
                                            <Field placeholder="First Name" type="text" name="firstName" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                            <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs text-start" />
                                        </div>
                                        <div className='w-1/2 flex flex-col items-start justify-center'>
                                            <Field placeholder="Last Name" type="text" name="lastName" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                            <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs text-start" />
                                        </div>
                                    </div>
                                </div>
                                <div className='w-3/6 flex flex-col items-start'>
                                    <h6>Company Name (optional)</h6>
                                    <div className='w-full flex flex-col items-start justify-center'>
                                        <Field type="text" name="companyName" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                        <ErrorMessage name="companyName" component="div" className="text-red-500 text-xs text-start" />
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex gap-6 px-12'>
                                <div className='w-full flex flex-col items-start justify-center'>
                                    <h6>Address</h6>
                                    <Field type="text" name="houseAddress" as="textarea" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="houseAddress" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                            </div>
                            <div className='w-full flex gap-2 px-12'>
                                <div className='w-1/4 flex flex-col items-start'>
                                    <h6>Country</h6>
                                    <Field type="text" name="country" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="country" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                                <div className='w-1/4 flex flex-col items-start'>
                                    <h6>Region/State</h6>
                                    <Field type="text" name="state" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="state" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                                <div className='w-1/4 flex flex-col items-start'>
                                    <h6>City</h6>
                                    <Field type="text" name="city" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                                <div className='w-1/4 flex flex-col items-start'>
                                    <h6>Zip Code</h6>
                                    <Field type="text" name="zipcode" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="zipcode" component="div" className="text-red-500 text-xs text-start" />
                                </div>

                            </div>
                            <div className='w-full flex gap-2 px-12'>
                                <div className='w-1/2 flex flex-col items-start justify-center'>
                                    <h2>Email (Optional)</h2>
                                    <Field type="text" name="email" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                                <div className='w-1/2 flex flex-col items-start justify-center'>
                                    <h2>Phone</h2>
                                    <Field type="text" name="phone" className="w-full bg-blue-gray-50 rounded-md mt-2 py-2 px-3 text-sm outline-none border border-gray-200" />
                                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs text-start" />
                                </div>
                            </div>
                            <div className='w-full px-12 flex justify-end'>
                                <Button type='submit'>Save Changes</Button>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    )
}

export default CreateAddress