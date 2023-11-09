import React, { useEffect } from 'react'
import ProfileSidebar from '../../../components/ProfileSidebar/ProfileSidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, getAllAddresses } from '../../../store/actions/user/userActions';

function Profile() {
    const dispatch = useDispatch();
 
    return (
        <>
            <div className='w-screen h-screen px-24 py-4 gap-4 flex items-start justify-between'>
                <ProfileSidebar />
                <Outlet />
            </div>
        </>
    )
}

export default Profile