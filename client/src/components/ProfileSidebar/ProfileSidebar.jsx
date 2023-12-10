import { List, ListItem } from '@material-tailwind/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProfileSidebar() {
    const navigate = useNavigate();
    return (
        <>
        <div className='bg-white w-3/12 shadow-sm hidden lg:block'>
            <List>
                <ListItem onClick={() => navigate('')}>Dashboard</ListItem>
                <ListItem onClick={() => navigate('account')}>Account Details</ListItem>
                <ListItem onClick={() => navigate('address')}>Shipping Address</ListItem>
                <ListItem onClick={() => navigate('wallet')}>Wallet</ListItem>
                <ListItem>Logout</ListItem>
            </List>
        </div>
            
        </>
    )
}

export default ProfileSidebar