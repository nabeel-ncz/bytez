import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail, sendOtp, fetchUser } from '../../../store/actions/user/userActions';
import CountdownTimer from '../../../components/CountdownTimer/CountdownTimer';
import { resetError } from '../../../store/reducers/user/userSlice';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

function OtpValidation() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useSearchParams();

    const initialTime = localStorage.getItem('timer') || 120;
    const [time, setTime] = useState(parseInt(initialTime, 10));

    const user = useSelector((state) => state.user?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(resetError());
    }, []);

    const query = search.get("request");
    const email = search.get("email");
    useEffect(() => {
        if (query && email) {
            dispatch(sendOtp(email));
            setTime(120);
        } else {
            setTime(0);
            navigate('/page_not_found');
        }
    }, []);

    const handleChange = (code) => {
        setOtp(code);
    }
    const handleOtpSubmit = () => {
        if (otp.length < 6) {
            setError("OTP must be contain 6 characters");
        } else {
            const data = { otp: otp };
            dispatch(verifyEmail(data)).then((response) => {
                if (response.payload?.status === "ok") {
                    navigate('/');
                    toast.success("Your account was successfully verified!");
                }
            })
        }
    }

    return (
        <>
            <div className='outer-container z-10'>
                <img src="/images/auth-bg.png" alt="" className='2xl:w-full 2xl:h-auto h-full object-cover' />
                <div className="container" >
                    <div className='content'>
                        <div className='text-white text-2xl text-start mb-2'>
                            <h2 className='font-semibold uppercase'>Email Verification</h2>
                            <h2 className='font-extralight'>Please check your email</h2>
                        </div>
                        <div className='form-container mt-4 mb-8'>
                            <h2 className="text-red-500 text-xs text-start my-2">{user?.error ? user.error : error}</h2>
                            <OTPInput
                                value={otp}
                                onChange={handleChange}
                                numInputs={6}
                                renderSeparator={
                                    (<span className='w-4'></span>)
                                }
                                renderInput={(props) => <input {...props} />}
                                shouldAutoFocus={true}
                                inputType={"tel"}
                                inputStyle={{
                                    border: "2px solid #ffffff",
                                    borderRadius: "8px",
                                    width: "54px",
                                    height: "54px",
                                    fontSize: "20px",
                                    color: "#ffffff",
                                    fontWeight: "400",
                                    caretColor: "#ffffff",
                                    backgroundColor: "transparent",
                                    textTransform: "uppercase",
                                }}
                                focusStyle={{
                                    border: "1px solid #ffffff",
                                    outline: "none"
                                }}
                            />
                            <CountdownTimer time={time} setTime={setTime} email={email} />
                            <div className='w-full h-12 flex items-center justify-between gap-2'>
                                <button onClick={() => navigate('/')} className='w-1/3 h-full mt-6 rounded-3xl flex items-center justify-center bg-transparent border-2 border-white text-white'>
                                    <span className='font-semibold text-base'>Do Later</span>
                                </button>
                                <button onClick={handleOtpSubmit} className='w-2/3 h-full px-8 mt-6 rounded-3xl bg-white flex items-center justify-between'>
                                    <span className='font-semibold text-base'>Verify Email</span>
                                    <img src="/icons/arrow-left-icon.png" alt="" className='h-8' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OtpValidation