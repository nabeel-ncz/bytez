import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Popover, PopoverHandler, PopoverContent, Button, Card, List, ListItem } from '@material-tailwind/react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/user/userActions';
import SearchDialog from '../CustomDialog/SearchDialog';
import { Transition } from "@headlessui/react";
import { CgMenu } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiShoppingBag } from "react-icons/fi";

function Header() {
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const user = useSelector(state => state.user?.user?.data);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    }
    const handleSearchOpen = () => {
        setSearchOpen(state => !state);
    }
    return (
        <>
            <div>
                <nav className="bg-white fixed top-0 w-full z-50" style={{ boxShadow: '0px 1px 20px 4px rgba(0, 0, 0, 0.08)' }}>
                    <div className="w-full md:px-24 px-12 py-2">
                        <div className="w-full flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        className="w-20"
                                        src="/icons/bytez-logo.png"
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline gap-2 space-x-4">
                                        <Link className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"/"}>HOME</Link>
                                        <Link className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"store"}>STORE</Link>
                                        <h1 className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium cursor-pointer' >BLOG</h1>
                                        <h1 className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium cursor-pointer' >CONTACT</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <button onClick={handleSearchOpen} variant={"text"} className='md:hidden'>
                                    <FiSearch size={'26px'} />
                                </button>
                                <button variant={"text"} onClick={() => setIsOpen(!isOpen)} className='md:hidden'>
                                    {!isOpen ? (
                                        <CgMenu size={'26'} color='black' />
                                    ) : (
                                        <IoCloseOutline size={'26'} color='black' />
                                    )}
                                </button>
                                <div className='hidden md:flex items-center justify-center'>
                                    <Button onClick={handleSearchOpen} variant={"text"} className=''>
                                        <FiSearch size={'26px'} />
                                    </Button>
                                    <Button variant={"text"} onClick={() => navigate("cart")}>
                                        <FiShoppingBag size={'26px'} />
                                    </Button>
                                    <Popover placement="bottom-end">
                                        <PopoverHandler>
                                            <Button variant={"text"} className=''>
                                                <FiUser size={'26px'} />
                                            </Button>
                                        </PopoverHandler>
                                        <PopoverContent className="z-50">
                                            <List>
                                                {user ?
                                                    <>
                                                        <ListItem onClick={() => navigate("wishlist")}>Wishlist</ListItem>
                                                        <ListItem onClick={() => navigate("orders")}>Orders</ListItem>
                                                        <ListItem onClick={() => navigate("coupons")}>Coupons</ListItem>
                                                        <ListItem onClick={() => navigate("profile")}>Profile</ListItem>
                                                        <ListItem onClick={handleLogout}>Log Out</ListItem>
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
                        </div>
                    </div>

                    <Transition
                        show={isOpen}
                        enter="transition ease-out duration-100 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        {(ref) => (
                            <div className="md:hidden absolute left-0 w-full" id="mobile-menu">
                                <div ref={ref} className="w-full">
                                    <div className='bg-white w-full absolute opacity-100 flex flex-col items-center justify-center gap-2 py-4'>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"/"}>HOME</Link>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"store"}>STORE</Link>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"profile"}>PROFILE</Link>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"orders"}>ORDERS</Link>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"cart"}>CART</Link>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"wishlist"}>WISHLIST</Link>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"blog"}>BLOG</Link>
                                        <Link onClick={() => setIsOpen(!isOpen)} className='text-gray-900 hover:text-black py-2 rounded-md text-sm font-medium' to={"contact"}>CONTACT</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Transition>
                </nav >
            </div >
            {/* <div className='header fixed top-0 z-40 w-full h-[70px] bg-white flex items-center justify-between px-24' style={{ boxShadow: '0px 1px 20px 4px rgba(0, 0, 0, 0.08)' }}>
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
                    <Button onClick={handleSearchOpen} variant={"text"} className='mr-[-0.5rem]'>
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
                                        <ListItem onClick={() => navigate("orders")}>Orders</ListItem>
                                        <ListItem onClick={() => navigate("profile")}>Profile</ListItem>
                                        <ListItem onClick={handleLogout}>Log Out</ListItem>
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
            </div> */}
            <SearchDialog open={searchOpen} handleOpen={handleSearchOpen} />
        </>
    )
}

export default Header