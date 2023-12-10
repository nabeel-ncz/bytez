import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import signupSchema from '../../../schema/user/signupSchema';
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, register } from '../../../store/actions/user/userActions';
import "../Style.css";
import { resetError } from '../../../store/reducers/user/userSlice';
import toast from 'react-hot-toast';

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search, setSearch] = useSearchParams();
    const user = useSelector((state) => state.user?.user);
    const verified = useSelector(state => state.user?.user?.data?.verified);

    useEffect(() => {
        dispatch(resetError());
    },[]);

    const handleSubmit = (data) => {
        const referral = search.get('referral') || null;
        dispatch(register({ userCredentials: {...data, referral} })).then((response) => {
            if(response?.payload?.status === "ok"){
                navigate(`/verify/email?request=true&email=${data.email}`);
            }
        }).catch(() => {
            console.log('error');
        })
    }

    return (
        <>
            <div className='outer-container'>
                <img src="/images/auth-bg.png" alt="" className='2xl:w-full 2xl:h-auto h-full object-cover' />
                <div className="container" >
                    <div className='content'>
                        <div className='text-white text-2xl text-start mb-2'>
                            <h2 className='font-semibold'>CREATE AN ACCOUNT</h2>
                            <h2 className='font-extralight'>Welcome To Bytez</h2>
                        </div>
                        <div className='form-container'>
                            <Formik
                                initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
                                validationSchema={signupSchema}
                                onSubmit={(values) => {
                                    handleSubmit(values);
                                }}
                            >
                                <Form className='flex flex-col'>
                                    <h2 className="text-red-500 text-xs text-start">{user?.error}</h2>
                                    <div className='form-control'>
                                        <img src="/icons/user-white-icon.png" alt="" className='w-5' />
                                        <Field type="text" name="name" placeholder="Enter your name" className="form-control-input bg-custom-selection" autoComplete="off" />
                                    </div>
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs text-start" />
                                    <div className='form-control'>
                                        <img src="/icons/mail-icon.png" alt="" className='w-5' />
                                        <Field type="text" name="email" placeholder="Enter your email" className="form-control-input bg-custom-selection" autoComplete="off" />
                                    </div>
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs text-start" />
                                    <div className='form-control'>
                                        <img src="/icons/lock-icon.png" alt="" className='w-5' />
                                        <Field type="password" name="password" placeholder="Enter your password" className="form-control-input" />
                                    </div>
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs text-start" />
                                    <div className='form-control'>
                                        <img src="/icons/lock-icon.png" alt="" className='w-5' />
                                        <Field type="password" name="confirmPassword" placeholder="Confirm password" className="form-control-input" />
                                    </div>
                                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs text-start" />
                                    <button type='submit' className='form-control-button'>
                                        <span className='font-semibold text-base'>Continue</span>
                                        <img src="/icons/arrow-left-icon.png" alt="" className='h-8' />
                                    </button>
                                </Form>
                            </Formik>
                            <h2 className='mt-8 text-white text-start text-sm font-extralight'>Already have an account?
                                <Link to={"/login"}><span className='font-medium'>Login Now</span></Link>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup