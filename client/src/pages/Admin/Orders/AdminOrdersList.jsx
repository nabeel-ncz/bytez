import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus } from '../../../store/actions/admin/adminActions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Chip } from '@material-tailwind/react';
import Pagination from '../../../components/Pagination/Pagination';
import { Tabs, Tab, TabsHeader, Button } from '@material-tailwind/react';
import { handleDownloadPDF } from '../../../components/ExportFile/PdfFileExport';
import { BASE_URL } from '../../../constants/urls';

function AdminOrdersList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orders = useSelector(state => state.admin?.orders?.data);
    const [activePage, setActivePage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [filterBy, setFilterBy] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchQuery, setSearchQuery] = useSearchParams();

    useEffect(() => {
        const value = searchQuery.get('filter_by');
        setFilterBy(value);
    }, [searchQuery]);

    useEffect(() => {
        dispatch(getAllOrders({
            page: activePage,
            limit: 5,
            filterBy: filterBy,
            startDate,
            endDate,
        })).then((response) => {
            if (response.payload?.totalPage) {
                setTotalPage(response.payload?.totalPage);
            }
        });
    }, [activePage, filterBy, startDate, endDate]);

    const next = () => {
        if (activePage === totalPage) return;
        setActivePage(state => state + 1);
    };
    const prev = () => {
        if (activePage === 1) return;
        setActivePage(state => state - 1);
    };

    return (
        <div className='w-full min-h-screen py-6'>
            <div className="flex justify-between items-center text-xs font-semibold">
                <div>
                    <h1 className="font-bold text-2xl">Orders</h1>
                    {/* <Breadcrumbs>
                        <Link to={"/admin"} className="opacity-60">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </Link>
                        <Link to={"/admin/products"}>
                            Products
                        </Link>
                    </Breadcrumbs> */}
                </div>
                <div>
                    <Button onClick={() => handleDownloadPDF(orders)}>Download</Button>
                </div>
            </div>
            <div className="lg:flex justify-between items-center text-xs font-semibold">
                <div className="flex my-2 gap-3 items-center justify-center">
                    <label htmlFor="" className='text-base'>Filter By Status : </label>
                    <select name="" id="" onChange={(event) => { setFilterBy(event.target.value) }} value={filterBy} className='p-2 text-base'>
                        <option value='all'>all</option>
                        <option value='pending'>Pending</option>
                        <option value='processing'>Processing</option>
                        <option value='shipped'>Shipped</option>
                        <option value='delivered'>Delivered</option>
                        <option value='cancelled'>Cancelled</option>
                        <option value='rejected'>Rejected</option>
                        <option value='return requested'>Return Requested</option>
                        <option value='return cancelled'>Request Cancelled</option>
                        <option value='request approved'>Request Approved</option>
                        <option value='return recieved'>Return Recieved</option>
                        <option value='return rejected'>Return Rejected</option>
                        <option value='return accepted'>Return Accepted</option>
                    </select>
                </div>
                <div className="flex my-2 gap-3 items-center justify-center">
                    <label htmlFor="" className='text-sm'>Start Date : </label>
                    <input type="date" className='text-base font-normal p-2' onChange={(evt) => setStartDate(evt.target.value)}/>
                    <label htmlFor="" className='text-sm'>End Date : </label>
                    <input type="date" className='text-base font-normal p-2' onChange={(evt) => setEndDate(evt.target.value)}/>
                </div>
            </div>
            <div className='bg-white rounded p-8 overflow-x-scroll'>
                <table className="w-full table-auto">
                    <thead className="font-normal">
                        <tr className="border-b border-gray-200">
                            <th className="font-semibold p-4 text-left border-r">No</th>
                            <th className="font-semibold p-4 text-left border-r">Item</th>
                            <th className="font-semibold p-4 text-left border-r">Total Price</th>
                            <th className="font-semibold p-4 text-left border-r">Address</th>
                            <th className="font-semibold p-4 text-left border-r">Status</th>
                            <th className="font-semibold p-4 text-left border-r">Order Placed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((doc, index) => (
                            <tr onClick={() => navigate(`/admin/orders/view/${doc._id}`)} key={doc._id} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                                <td className="text-sm p-4 text-start border-r">{(((activePage - 1) * 5) + (index + 1))}</td>
                                <td className="text-sm p-4 flex items-center gap-2 text-start border-r">
                                    <div className="w-14 overflow-clip flex justify-center items-center">
                                        <img
                                            src={`${BASE_URL}/products/resized/${doc?.items[0]?.image}`}
                                            alt="img"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <div className='flex flex-col items-start justify-center'>
                                        <h2 className='text-lg font-medium'>{doc?.items[0]?.name}</h2>
                                        {doc.itemsQuantity > 1 && (
                                            <h2 className='text-xs font-normal'>+{doc.itemsQuantity - 1} Other Products</h2>
                                        )}
                                    </div>
                                </td>
                                <td className="text-sm p-4 text-start border-r">₹ {doc?.totalPrice}</td>
                                <td className="text-sm p-4 text-start border-r">
                                    <h2>{doc?.address?.fullName}</h2>
                                    <h2>{doc?.address?.address}</h2>
                                    <h2>{doc?.address?.zipcode}</h2>
                                    <h2>{doc?.address?.email}</h2>
                                    <h2>{doc?.address?.phone}</h2>
                                </td>
                                <td className="text-sm p-4 text-start border-r">
                                    {doc?.status === "pending" ?
                                        <Chip variant="ghost" color={"yellow"} size="sm" value={"Placed"} className='text-center' />
                                        : doc?.status === "processing" ?
                                            <Chip variant="ghost" color={"light-blue"} size="sm" value={"Processing"} className='text-center' />
                                            : doc?.status === "shipped" ?
                                                <Chip variant="ghost" color={"indigo"} size="sm" value={"Shipped"} className='text-center' />
                                                : doc?.status === "delivered" ?
                                                    <Chip variant="ghost" color={"green"} size="sm" value={"Delivered"} className='text-center' />
                                                    : doc?.status === "cancelled" ?
                                                        <Chip variant="ghost" color={"orange"} size="sm" value={"Cancelled"} className='text-center' />
                                                        : doc?.status === "rejected" ?
                                                            <Chip variant="ghost" color={"pink"} size="sm" value={"Rejected"} className='text-center' />
                                                            : doc?.status === "return requested" ?
                                                                <Chip variant="ghost" color={"yellow"} size="sm" value={"Return Requested"} className='text-center' />
                                                                : doc?.status === "return cancelled" ?
                                                                    <Chip variant="ghost" color={"yellow"} size="sm" value={"Request Cancelled"} className='text-center' />
                                                                    : doc?.status === "request approved" ?
                                                                        <Chip variant="ghost" color={"blue"} size="sm" value={"Request Approved"} className='text-center' />
                                                                        : doc?.status === "return recieved" ?
                                                                            <Chip variant="ghost" color={"green"} size="sm" value={"Return Recieved"} className='text-center' />
                                                                            : doc?.status === "return accepted" ?
                                                                                <Chip variant="ghost" color={"indigo"} size="sm" value={"Return Accepted"} className='text-center' />
                                                                                : doc?.status === "return rejected" &&
                                                                                <Chip variant="ghost" color={"red"} size="sm" value={"Return Rejected"} className='text-center' />
                                    }
                                </td>
                                <td className="text-sm p-4 text-start border-r">{new Date(doc.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            <div className='flex items-center justify-end p-4'>
                <Pagination next={next} prev={prev} total={totalPage} active={activePage} />
            </div>
        </div>
    )
}

export default AdminOrdersList