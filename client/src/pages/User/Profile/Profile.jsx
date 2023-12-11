import React, { useEffect, useState } from 'react'
import ProfileSidebar from '../../../components/ProfileSidebar/ProfileSidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Drawer, List, ListItem, IconButton } from '@material-tailwind/react';

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);
    const handleLogout = () => {
        dispatch(logout());
    }
    return (
        <>
            <>
                <div className='w-full flex lg:hidden items-center justify-end py-1 px-6 md:px-24'>
                    <Button variant='outlined' size='sm' onClick={openDrawer}>Other</Button>
                </div>
                <div className='w-screen h-screen px-6 md:px-24 gap-4 flex items-start justify-between'>
                    <ProfileSidebar />
                    <Outlet />
                </div>
                <Drawer open={open} onClose={closeDrawer} className="p-4">
                    <div className='w-full flex items-start justify-end py-2'>
                        <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </IconButton>
                    </div>
                    <List>
                        <ListItem onClick={() => { navigate(''); closeDrawer(); }}>Dashboard</ListItem>
                        <ListItem onClick={() => { navigate('account'); closeDrawer(); }}>Account Details</ListItem>
                        <ListItem onClick={() => { navigate('address'); closeDrawer(); }}>Shipping Address</ListItem>
                        <ListItem onClick={() => { navigate('wallet'); closeDrawer(); }}>Wallet</ListItem>
                        <ListItem onClick={() => { handleLogout(); }}>Logout</ListItem>
                    </List>
                </Drawer>
            </>
        </>
    )
}

export default Profile