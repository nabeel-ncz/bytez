import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Popover, PopoverHandler, PopoverContent, Button, Card, List, ListItem } from '@material-tailwind/react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/user/userActions';

function Header() {
    const navigate = useNavigate();
    const user = useSelector(state => state.user?.user?.data);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    }
    return (
        <div className='header fixed top-0 z-40 w-full h-[70px] bg-white flex items-center justify-between px-24' style={{ boxShadow: '0px 1px 20px 4px rgba(0, 0, 0, 0.08)' }}>
            <div className='flex items-center justify-center gap-4'>
                <div className='logo'>
                    <img src="/icons/bytez-logo.png" alt="" className='w-20' />
                </div>
                <div className='nav-links flex items-center justify-center gap-4
                text-xs font-medium'>
                    <Link to={"/"}>HOME</Link>
                    <Link to={"store"}>STORE</Link>
                    <h4>BLOG</h4>
                    <Link to={"contact"}>CONTACT</Link>
                </div>
            </div>
            <div className='flex items-center justify-center '>
                <Button variant={"text"} className='mr-[-0.5rem]'>
                    <img src="/icons/search-icon.png" alt="" />
                </Button>
                <Button variant={"text"} onClick={() => navigate("cart")}>
                    <img src="/icons/shopping-cart-icon.png" alt="" />
                </Button>
                <Popover placement="bottom-end">
                    <PopoverHandler>
                        <Button variant={"text"} className='ml-[-0.5rem]'>
                            <img src="/icons/user-icon.png" alt="" />
                        </Button>
                    </PopoverHandler>
                    <PopoverContent className="z-50">
                        <List>
                            {user ?
                                <>
                                    <ListItem onClick={handleLogout}>Log Out</ListItem>
                                    <ListItem onClick={() => navigate("profile")}>Profile</ListItem>
                                </>
                                : (
                                    <>
                                        <ListItem onClick={() => navigate('login')}>Log In</ListItem>
                                        <ListItem onClick={() => navigate('signup')}>Sign Up</ListItem>
                                    </>
                                )}
                        </List>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default Header