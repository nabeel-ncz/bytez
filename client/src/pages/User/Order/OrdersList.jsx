import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, getAllOrders } from '../../../store/actions/user/userActions';
import { Chip } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

function OrdersList() {
    const navigate = useNavigate();
    const orders = useSelector(state => state?.user?.orders?.data);
    const user = useSelector(state => state?.user?.user?.data);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUser()).then((response) => {
            dispatch(getAllOrders(user?._id ? user._id : response?.paylaod?.data?._id));
        })
    }, []);
    return (
        <>
            <div className='w-full min-h-screen px-24 py-6'>
                <div className='bg-white rounded p-8'>
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
                                <tr key={doc._id} onClick={() => { navigate(`/orders/view/${doc._id}`)}} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                                    <td className="text-sm p-4 text-start border-r">{index + 1}</td>
                                    <td className="text-sm p-4 flex items-center gap-2 text-start border-r">
                                        <div className="w-14 overflow-clip flex justify-center items-center">
                                            <img
                                                src={`http://localhost:3000/products/resized/${doc?.items[0]?.image}`}
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
                                        : doc?.status === "returned" &&
                                        <Chip variant="ghost" color={"red"} size="sm" value={"Returned"} className='text-center' />
                                        }
                                    </td>
                                    <td className="text-sm p-4 text-start border-r">{new Date(doc.createdAt).toLocaleString()}</td>
                                    <td className="text-sm p-4 text-start border-r">{new Date(doc.deliveryDate).toLocaleString()}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default OrdersList