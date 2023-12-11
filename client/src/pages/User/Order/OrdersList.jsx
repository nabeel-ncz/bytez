import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, getAllOrders } from '../../../store/actions/user/userActions';
import { Chip } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/Pagination/Pagination';
import { BASE_URL } from '../../../constants/urls';
import PageLoading from '../../../components/Loading/PageLoading';

function OrdersList() {
    const navigate = useNavigate();
    const orders = useSelector(state => state?.user?.orders?.data);
    const ordersLoading = useSelector(state => state?.user?.orders?.loading);
    const ordersTotalCount = useSelector(state => state?.user?.orders?.totalCount);
    const user = useSelector(state => state?.user?.user?.data);
    const [active, setActive] = useState(1)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser()).then((response) => {
            dispatch(getAllOrders({
                id: user?._id ? user._id : response?.paylaod?.data?._id,
                page: active,
                limit: 4,
            }));
        })
    }, [active]);


    const next = () => {
        if (active === ordersTotalCount) return;
        setActive(state => state + 1);
    };
    const prev = () => {
        if (active === 1) return;
        setActive(state => state - 1);
    };

    return (
        <>
            {ordersLoading ? <PageLoading /> : (
                <div className='w-full min-h-screen lg:px-24 px-4 py-6'>
                    {(orders?.length <= 0 || !orders) ? (
                        <h2>There is no orders!</h2>
                    ) : (
                        <>
                            <div className='bg-white rounded md:p-8 p-2 w-full overflow-x-auto'>
                                <table className="w-full min-w-max table-auto">
                                    <thead className="font-normal">
                                        <tr className="border-b border-gray-200">
                                            <th className="font-semibold p-4 text-left border-r">No</th>
                                            <th className="font-semibold p-4 text-left border-r">Item</th>
                                            <th className="font-semibold p-4 text-left border-r">Total Price</th>
                                            <th className="font-semibold p-4 text-left border-r">Status</th>
                                            <th className="font-semibold p-4 text-left border-r">Order Placed</th>
                                            <th className="font-semibold p-4 text-left border-r">Expected Delivery</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders?.map((doc, index) => (
                                            <tr key={doc._id} onClick={() => { navigate(`/orders/view/${doc._id}`) }} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                                                <td className="text-sm p-4 text-start border-r">{(((active - 1) * 4) + (index + 1))}</td>
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
                                                <td className="text-sm p-4 text-start border-r">{new Date(doc.deliveryDate).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className='w-full flex items-center justify-end p-4'>
                                <Pagination next={next} prev={prev} active={active} total={ordersTotalCount} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default OrdersList