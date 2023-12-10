import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { resetPasswordVerifyApi } from '../../../services/api';

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);

    const [search, setSearch] = useSearchParams();
    const token = search.get("token");

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("password and confirm password must be match!");
        } else if (!token) {
            setError("Token is not exist, Please try again!");
        } else {
            resetPasswordVerifyApi({
                token,
                password
            }).then((response) => {
                if (response?.data?.status === "ok") {
                    toast.success("Your password was successfully updated!");
                    navigate(`/login`);
                } else {
                    toast.error("There is something went wrong, Please try again later!");
                    navigate(`/login`);
                }
            })
        }
    }
    return (
        <div className='outer-container'>
            <img src="/images/auth-bg.png" alt="" className='2xl:w-full 2xl:h-auto h-full object-cover' />
            <div className="container" >
                <div className='content'>
                    <div className='text-white text-2xl text-start mb-2'>
                        <h2 className='font-semibold'>PLEASE ENTER YOUR NEW PASSWORD</h2>
                        <h2 className='font-extralight text-sm'>we will update your password asap!</h2>
                    </div>

                    <div className='form-container'>
                        <form onSubmit={handleFormSubmit} className='flex flex-col'>
                            {error && <h2 className="text-red-500 text-xs text-start">{error}</h2>}
                            <div className='form-control'>
                                <img src="/icons/lock-icon.png" alt="" className='w-5' />
                                <input type="password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$" title="Must contain at least one lowercase letter, one uppercase letter, and one number"
                                    value={password} onChange={(event) => { setPassword(event.target.value) }} required placeholder="New password" className="form-control-input bg-custom-selection" autoComplete="off" />
                            </div>
                            <div className='form-control'>
                                <img src="/icons/lock-icon.png" alt="" className='w-5' />
                                <input type="password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$" title="Must contain at least one lowercase letter, one uppercase letter, and one number"
                                    value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value) }} required placeholder="Confirm password" className="form-control-input bg-custom-selection" autoComplete="off" />
                            </div>
                            <button type='submit' className='form-control-button'>
                                <span className='font-semibold text-base'>Continue</span>
                                <img src="/icons/arrow-left-icon.png" alt="" className='h-8' />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword