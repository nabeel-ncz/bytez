import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendOtp } from '../../store/actions/user/userActions';

function CountdownTimer({time, setTime}) {
    const intervalRef = useRef();
    const dispatch = useDispatch();

    const decreaseTime = () => {
        if (time > 0) {
            setTime(prev => prev - 1)
        } else {
            clearInterval(intervalRef.current);
            localStorage.removeItem('timer');
        }
    };

    useEffect(() => {
        localStorage.setItem('timer', time.toString());
        intervalRef.current = setInterval(decreaseTime, 1000);
        return () => { clearInterval(intervalRef.current) };
    }, [time]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        return formattedTime;
    };

    const handleResendOtp = () => {
        dispatch(sendOtp());
    }
    return (
        <>
        {time > 0 ? (
            <h2 className='my-4 text-start text-sm font-medium text-white'>{formatTime(time)}</h2>
        ) : (
            <h2 className='my-4 text-white text-start text-sm font-extralight'>Don't get the OTP ?
                <span onClick={handleResendOtp} className='font-medium'> Resend Otp</span>
            </h2>
        )}
        </>
    )
}

export default CountdownTimer