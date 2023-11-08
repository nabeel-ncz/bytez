import React from 'react'
import ProfileSidebar from '../../../components/ProfileSidebar/ProfileSidebar'
import { Outlet } from 'react-router-dom'

function Profile() {
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