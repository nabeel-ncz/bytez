import React, {useEffect} from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import "../Style.css";
import loginSchema from '../../../schema/user/loginSchema';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, login } from '../../../store/actions/user/userActions';
import { resetError } from '../../../store/reducers/user/userSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetError());
  }, [])

  const error = useSelector(state => state?.user?.error);

  const handleFormSubmit = (data) => {
    dispatch(login({ userCredentials: data })).then((result) => {
      if(result.payload?.status === "ok"){
        if(result.payload?.data?.role === "User"){
          navigate('/');
        } else {
          dispatch(fetchUser());
          navigate('/admin/');
        }
      }
    })
  }
  return (
    <>
      <div className='outer-container'>
        <img src="/images/auth-bg.png" alt="" className='w-full h-auto' />
        <div className="container" >
          <div className='content'>
            <div className='text-white text-2xl text-start mb-2'>
              <h2 className='font-semibold'>EXISTING MEMBER</h2>
              <h2 className='font-extralight'>Welcome Back!</h2>
            </div>
            <div className='form-container'>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={(values) => {
                  handleFormSubmit(values)
                }}
              >
                <Form action="" className='flex flex-col'>
                  {error && <h2 className="text-red-500 text-xs text-start">{error}</h2>}
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
                  <h2 className='text-start mt-2 font-normal text-sm text-white'>Forgot your password ?</h2>
                  <button type='submit' className='form-control-button'>
                    <span className='font-semibold text-base'>Continue</span>
                    <img src="/icons/arrow-left-icon.png" alt="" className='h-8' />
                  </button>
                </Form>
              </Formik>
              <div className='relative w-full text-center my-8'>
                <div className='w-full absolute top-0 bottom-2 flex items-center justify-center'>
                  <h2 className='font-normal text-sm text-white'>OR</h2>
                </div>
                <div className='flex items-center justify-between opacity-50'>
                  <hr className='w-[44%]' />
                  <hr className='w-[44%]' />
                </div>
              </div>
              <div className='social-login'>
                <img src="/icons/google-icon.png" alt="" className='h-12' />
                <img src="/icons/facebook-icon.png" alt="" className='h-12' />
                <img src="/icons/apple-icon.png" alt="" className='h-12' />
              </div>
              <h2 className='mt-8 text-white text-start text-sm font-extralight'>Don’t have account?
                <Link to={"/signup"}><span className='font-medium'>Register Now</span></Link>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login