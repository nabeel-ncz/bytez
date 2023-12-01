import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/actions/user/userActions';
import { RxDashboard } from "react-icons/rx";
import { FiShoppingBag } from 'react-icons/fi';
import { IoCashOutline } from 'react-icons/io5';
import { RiCouponLine } from "react-icons/ri";
import { BsPostcard } from "react-icons/bs"
import { AiOutlineBlock } from 'react-icons/ai'
import { TbBrandAppgallery } from "react-icons/tb";
import { TbBrandBumble } from "react-icons/tb";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";

function SideNavbar({ sidebarOpen, setSidebarOpen }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;

    const trigger = useRef(null);
    const sidebar = useRef(null);

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
        storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    );

    const handleLogout = () => {
        dispatch(logout()).then(() => {
            navigate('/');
        })
    }

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
        localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
        if (sidebarExpanded) {
            document.querySelector('body')?.classList.add('sidebar-expanded');
        } else {
            document.querySelector('body')?.classList.remove('sidebar-expanded');
        }
    }, [sidebarExpanded]);


    return (
        <>
            <aside
                ref={sidebar}
                className={`absolute left-0 top-0 z-50 flex h-screen w-56 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between gap-2 ps-2 pe-6 py-3 lg:py-6.5">
                    <NavLink to="/">
                        <img src="/icons/bytez-logo.png" alt="Logo" className='w-16' />
                    </NavLink>
                    <button
                        ref={trigger}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-controls="sidebar"
                        aria-expanded={sidebarOpen}
                        className="block lg:hidden"
                    >
                        <svg className="fill-current" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                            <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" fill="" />
                        </svg>
                    </button>
                </div>

                <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                    {/* <!-- Sidebar Menu --> */}
                    <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                        {/* <!-- Menu Group --> */}
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-start">
                                MENU
                            </h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <li>
                                    <NavLink
                                        to=""
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <RxDashboard />
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="orders"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <FiShoppingBag />
                                        Orders List
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="products"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <TbBrandAppgallery />
                                        Products List
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="payments"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <IoCashOutline />
                                        Payments
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="coupons"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <RiCouponLine />
                                        Coupons
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="banners"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <BsPostcard />
                                        Banners
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="categories"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <AiOutlineBlock />
                                        Categories
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="brands"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <TbBrandBumble />
                                        Brands
                                    </NavLink>
                                </li>

                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-start">
                                USER MANAGEMENT
                            </h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <li>
                                    <NavLink
                                        to="customers"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <LuUsers2 />
                                        Customers
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="admins"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        <MdOutlineAdminPanelSettings />
                                        Admins
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-start">
                                OTHER
                            </h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                <li>
                                    <NavLink
                                        to="help"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        Help
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="settings"
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        Settings
                                    </NavLink>
                                </li>
                                <li>
                                    <h2
                                        onClick={handleLogout}
                                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-300 ${pathname.includes('dashboard') && "bg-gray-300"}`}
                                    >
                                        Logout
                                    </h2>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default SideNavbar;