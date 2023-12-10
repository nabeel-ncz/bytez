import { List, ListItem } from '@material-tailwind/react'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/actions/user/userActions';

function ProfileSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
    }
    return (
        <>
            <div className='bg-white w-3/12 shadow-sm hidden lg:block'>
                <List>
                    <ListItem onClick={() => navigate('')}>Dashboard</ListItem>
                    <ListItem onClick={() => navigate('account')}>Account Details</ListItem>
                    <ListItem onClick={() => navigate('address')}>Shipping Address</ListItem>
                    <ListItem onClick={() => navigate('wallet')}>Wallet</ListItem>
                    <ListItem onClick={() => { handleLogout() }}>Logout</ListItem>
                </List>
            </div>

        </>
    )
}

export default ProfileSidebar