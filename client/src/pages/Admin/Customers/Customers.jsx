import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Chip } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import CustomTabs from '../../../components/Tabs/CustomTabs';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../../store/actions/admin/adminActions';
import Pagination from '../../../components/Pagination/Pagination';

function Customers() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customers = useSelector(state => state?.admin?.customers?.data);
    const [activePage, setActivePage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        dispatch(getAllUsers({
            page: activePage,
            limit: 5,
        })).then((response) => {
            if (response?.payload?.totalPage) {
                setTotalPage(response?.payload?.totalPage);
            };
        })
    }, [activePage]);

    const next = () => {
        if (activePage === totalPage) return;
        setActivePage(state => state + 1);
    };
    const prev = () => {
        if (activePage === 1) return;
        setActivePage(state => state - 1);
    };

    return (
        <>
            <div className="p-5 w-full overflow-y-auto">
                <div className="flex justify-between items-center text-xs font-semibold">
                    <div>
                        <h1 className="font-bold text-2xl">Customers</h1>
                        <Breadcrumbs>
                            <Link to={"/admin"} className="opacity-60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" >
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                            </Link>
                            <Link to={"/admin/customers"}>
                                Customers
                            </Link>
                        </Breadcrumbs>
                    </div>
                    <div className="flex gap-3">

                    </div>
                </div>
                <div className="lg:flex justify-between items-center text-xs font-semibold">
                    {/* <CustomTabs /> */}
                    {/* <div className="flex my-2 gap-3">
                        <button className="flex items-center gap-2 p-2 rounded-lg bg-white">
                            Select Date
                        </button>
                        <button className="flex items-center gap-2 p-2 rounded-lg bg-white">
                            Filters
                        </button>
                    </div> */}
                </div>
                <div className="overflow-x-scroll lg:overflow-hidden bg-white rounded-lg">
                    <table className="w-full min-w-max table-auto">
                        <thead className="font-normal">
                            <tr className="border-b border-gray-200">
                                <th className="font-semibold p-4 text-left border-r">Name</th>
                                <th className="font-semibold p-4 text-left border-r">Email</th>
                                <th className="font-semibold p-4 text-left border-r">Phone</th>
                                <th className="font-semibold p-4 text-left border-r">Created At</th>
                                <th className="font-semibold p-4 text-left border-r">Status</th>
                                <th className="font-semibold p-4 text-left border-r">Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers?.map((user) => (
                                <tr
                                    onClick={() => navigate(`/admin/customers/view/${user._id}`)} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}
                                >
                                    <td className="text-sm p-4 flex items-center gap-2 text-start border-r">
                                        <div className="w-10 h-10 overflow-clip flex justify-center items-center bg-blue-gray-50">

                                        </div>
                                        <span>{user.name}</span>
                                    </td>
                                    <td className="text-sm p-4 text-start border-r">
                                        {user.email}
                                    </td>
                                    <td className="text-sm p-4 text-start border-r">nil</td>
                                    <td className="text-sm p-4 text-start border-r">{new Date(user.createdAt).toLocaleString()}</td>
                                    <td className="text-sm p-4 text-start border-r">
                                        <Chip
                                            variant="ghost"
                                            color={user.isBlocked ? "red" : "green"}
                                            size="sm"
                                            value={user.isBlocked ? "blocked" : "active"}
                                            className='text-center'
                                        />
                                    </td>
                                    <td className="text-sm p-4 text-start border-r">
                                        <Chip
                                            variant="ghost"
                                            color={user.verified ? "blue" : "yellow"}
                                            size="sm"
                                            value={user.verified ? "Verified" : "Not Verified"}
                                            className='text-center'
                                        />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                <div className='flex items-center justify-end p-4'>
                    <Pagination next={next} prev={prev} total={totalPage} active={activePage} />
                </div>
            </div>
        </>
    )
}

export default Customers