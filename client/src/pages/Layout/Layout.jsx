import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../../components/Navbar/SideNavbar';
import TopNavbar from '../../components/Navbar/TopNavbar';

function Layout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {role === "User" ? (
        <>
          <Header />
          <div className='mt-24'>
            <Outlet />
          </div>
          <Footer />
        </>
      ) : (
        <>
          <div className="flex h-screen overflow-hidden text-blue-gray-800 bg-blue-gray-50">
            <SideNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Layout