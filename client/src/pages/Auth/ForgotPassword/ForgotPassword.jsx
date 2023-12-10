import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@material-tailwind/react';
import { forgorPasswordMailSendApi } from '../../../services/api';

function ForgotPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");

    const handleFormSubmit = () => {
        setLoading(true);
        forgorPasswordMailSendApi(email).then((response) => {
            if (response.data?.status === "ok") {
                navigate('/?email_send=true');
            } else if (response.data?.status === "error") {
                setError(response?.data?.message);
            }
        }).catch((error) => {
            setError(error?.message);
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <div className='outer-container'>
            <img src="/images/auth-bg.png" alt="" className='2xl:w-full 2xl:h-auto h-full object-cover' />
            <div className="container" >
                {loading ? (
                    <Spinner className="h-10 w-10" />
                ) : (
                    <div className='content'>
                        <div className='text-white text-2xl text-start mb-2'>
                            <h2 className='font-semibold'>FORGOT YOUR PASSWORD</h2>
                            <h2 className='font-extralight'>Don't worry we're here to help!!</h2>
                        </div>

                        <div className='form-container'>
                            <form onSubmit={handleFormSubmit} className='flex flex-col'>
                                {error && <h2 className="text-red-500 text-xs text-start">{error}</h2>}
                                <div className='form-control'>
                                    <img src="/icons/mail-icon.png" alt="" className='w-5' />
                                    <input type="email" value={email} onChange={(event) => { setEmail(event.target.value) }} required placeholder="Enter your email" className="form-control-input bg-custom-selection" autoComplete="off" />
                                </div>
                                <button type='submit' className='form-control-button'>
                                    <span className='font-semibold text-base'>Continue</span>
                                    <img src="/icons/arrow-left-icon.png" alt="" className='h-8' />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword