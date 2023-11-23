import React from 'react';
import { Button } from '@material-tailwind/react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/actions/user/userActions';

function BlockedUser() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  }
  return (
    <>
      <div className='w-screen h-screen bg-red-100 flex flex-col items-center justify-center'>
        <h2 className='font-medium text-xl'>You are blocked from the site</h2>
        <Button onClick={handleLogout} variant='gradient' size='sm'>Sign Out</Button>
      </div>
    </>
  )
}

export default BlockedUser