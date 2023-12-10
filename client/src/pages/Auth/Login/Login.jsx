import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import "../Style.css";
import loginSchema from '../../../schema/user/loginSchema';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, login } from '../../../store/actions/user/userActions';
import { resetError } from '../../../store/reducers/user/userSlice';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../../../constants/urls';

function Login() {
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  useEffect(() => {
    dispatch(resetError());
    const error = query.get("error");
    const decError = error ? decodeURIComponent(error) : "";
    setAuthError(decError);
  }, [])

  const error = useSelector(state => state?.user?.user?.error);

  const handleFormSubmit = (data) => {
    dispatch(login({ userCredentials: data })).then((result) => {
      if (result.payload?.status === "ok") {
        if (result.payload?.data?.role === "User") {
          navigate('/');
        } else {
          dispatch(fetchUser());
          navigate('/admin/');
        }
      }
    })
  }

  const handleGoogleAuth = () => {
    window.open(`${BASE_URL}/user/oauth2/google`, "_self");
  }

  return (
    <>
      <div className='outer-container'>
        <img src="/images/auth-bg.png" alt="" className='2xl:w-full 2xl:h-auto h-full object-cover' />
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
                  {(authError !== "") && <h2 className="text-red-500 text-xs text-start">{authError}</h2>}
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
                  <h2 onClick={() => { navigate(`/auth/forgot_password`)}} className='text-start mt-2 font-normal text-sm text-white'>Forgot your password ?</h2>
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
              <button onClick={handleGoogleAuth} className='w-full h-12 px-10 mt-6 rounded-3xl bg-transparent border-white border-2 flex items-center justify-center gap-3'>
                <img src="/icons/google-trsp-icon.png" alt="" className='h-6 lg:h-8'/>
                <span className='font-medium text-sm lg:text-base text-white'>Continue With Google</span>
              </button>
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