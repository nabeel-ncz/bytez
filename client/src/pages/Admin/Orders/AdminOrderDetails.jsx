import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Chip, Select, Option } from '@material-tailwind/react';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../../store/actions/admin/adminActions';
import AdminOrderStatusConfirmation from '../../../components/CustomDialog/AdminOrderStatusConfirmation';
import { getUserOrderInAdminApi } from '../../../services/api';
import { BASE_URL } from '../../../constants/urls';

function AdminOrderDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [order, setOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState("pending");
    const { id } = useParams();
    const [confirmationDialog, setConfirmationDialog] = useState(false);
    const [currData, setCurrData] = useState(null);

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        getUserOrderInAdminApi(id).then((response) => {
            if (response.data?.status === "ok") {
                setOrder(response?.data?.data);
                setOrderStatus(response?.data?.data?.status);
            }
        })
    }

    const handleStatusOnChange = (event) => {
        setOrderStatus(event.target.value);
    }

    const handleOrderStatusSubmit = (orderId, status) => {
        if (status === "delivered" || status === "return accepted") {
            setCurrData({ orderId, status })
            setConfirmationDialog(true);
        } else {
            dispatch(updateOrderStatus({
                orderId,
                status
            })).then((response) => {
                handleFetch();
            });
        }
    }

    const handleConfirmatioContinue = () => {
        dispatch(updateOrderStatus(currData)).then((response) => {
            handleFetch();
            setCurrData(null);
        });
        setConfirmationDialog(false)
    }
    const handleConfirmationBack = () => {
        setConfirmationDialog(false)
    }

    return (
        <>
            <div className='w-full min-h-screen px-4 md:px-12 lg:px-24 py-4'>
                <div className='flex flex-col items-center bg-white rounded shadow-sm'>
                    <div className='w-full p-6'>
                        <div className='w-full flex flex-col gap-2 md:gap-0 md:flex-row items-start md:items-center justify-between bg-gray-100 p-4 rounded border'>
                            <div className='flex flex-col items-start'>
                                <h2 className='font-medium text-base md:text-xl'>ODR{order?._id}</h2>
                                <h2 className='text-xs font-normal'>{order?.itemsQuantity} Products, Order Placed at {new Date(order?.createdAt).toLocaleString()}</h2>
                                <h2 className='text-xs font-normal'>Expected Order Delivery {new Date(order?.deliveryDate).toLocaleString()}</h2>
                            </div>
                            <h2 className='font-medium text-xl'>₹ {order?.totalPrice}</h2>
                        </div>
                    </div>
                    <div className='w-full px-6 py-4 flex justify-end'>
                        {!isChangingStatus ? (
                            <>
                                {order?.status === "pending" ?
                                    <Chip variant="ghost" color={"yellow"} size="sm" value={"Placed"} className='text-center' />
                                    : order?.status === "processing" ?
                                        <Chip variant="ghost" color={"light-blue"} size="sm" value={"Processing"} className='text-center' />
                                        : order?.status === "shipped" ?
                                            <Chip variant="ghost" color={"indigo"} size="sm" value={"Shipped"} className='text-center' />
                                            : order?.status === "delivered" ?
                                                <Chip variant="ghost" color={"green"} size="sm" value={"Delivered"} className='text-center' />
                                                : order?.status === "cancelled" ?
                                                    <Chip variant="ghost" color={"orange"} size="sm" value={"Cancelled"} className='text-center' />
                                                    : order?.status === "rejected" ?
                                                        <Chip variant="ghost" color={"pink"} size="sm" value={"Rejected"} className='text-center' />
                                                        : order?.status === "return requested" ?
                                                            <Chip variant="ghost" color={"yellow"} size="sm" value={"Return Requested"} className='text-center' />
                                                            : order?.status === "return cancelled" ?
                                                                <Chip variant="ghost" color={"yellow"} size="sm" value={"Request Cancelled"} className='text-center' />
                                                                : order?.status === "request approved" ?
                                                                    <Chip variant="ghost" color={"blue"} size="sm" value={"Request Approved"} className='text-center' />
                                                                    : order?.status === "return recieved" ?
                                                                        <Chip variant="ghost" color={"green"} size="sm" value={"Return Recieved"} className='text-center' />
                                                                        : order?.status === "return accepted" ?
                                                                            <Chip variant="ghost" color={"indigo"} size="sm" value={"Return Accepted"} className='text-center' />
                                                                            : order?.status === "return rejected" &&
                                                                            <Chip variant="ghost" color={"red"} size="sm" value={"Return Rejected"} className='text-center' />
                                }
                            </>
                        ) : (
                            <>
                                {(order?.status.split(' ')[0] === "return" || order?.status.split(' ')[0] === "request") ? (<>
                                    <select className='me-4 border border-gray-400 rounded px-2 py-1' name='orderStatus' value={orderStatus} onChange={handleStatusOnChange}>
                                        <option value='return requested'>Return Requested</option>
                                        <option value='return cancelled'>Request Cancelled</option>
                                        <option value='request approved'>Request Approved</option>
                                        <option value='return recieved'>Return Recieved</option>
                                        <option value='return rejected'>Return Rejected</option>
                                        <option value='return accepted'>Return Accepted</option>
                                    </select>
                                </>) : (<>
                                    <select className='me-4 border border-gray-400 rounded px-2 py-1' name='orderStatus' value={orderStatus} onChange={handleStatusOnChange}>
                                        <option value='pending'>Pending</option>
                                        <option value='processing'>Processing</option>
                                        <option value='shipped'>Shipped</option>
                                        <option value='delivered'>Delivered</option>
                                        <option value='cancelled'>Cancelled</option>
                                        <option value='rejected'>Rejected</option>
                                    </select>
                                </>)}
                            </>
                        )}
                        {(order?.status !== "delivered" && order?.status !== "return accepted") && (
                            !isChangingStatus ? (
                                <Button onClick={() => setIsChangingStatus(true)}>Change</Button>
                            ) : (
                                <Button onClick={() => {
                                    setIsChangingStatus(false);
                                    handleOrderStatusSubmit(order?._id, orderStatus);
                                }}>Save</Button>
                            )
                        )}
                    </div>
                    <div className='w-full flex items-center justify-end pe-8'>
                        {order?.status === "cancelled" && (
                            <h2>Reason for the cancelation : {order?.cancelReason}</h2>
                        )}
                        {order?.status === "return requested" && (
                            <h2>Reason for the return : {order?.returnReason}</h2>
                        )}
                    </div>
                    <div className='w-full p-6 mt-12'>
                        <table className="w-full min-w-max table-auto">
                            <thead className="font-normal">
                                <tr className="border-b border-gray-200">
                                    <th className="font-semibold ps-2 text-left border-r">No</th>
                                    <th className="font-semibold text-left border-r">Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.items?.map((doc, index) => (
                                    <tr key={doc._id} onClick={() => { navigate(`/admin/orders/view/${doc._id}`) }} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                                        <td className="text-sm ps-2 text-start border-r">{index + 1}</td>
                                        <td className="text-sm flex items-center gap-2 text-start border-r">
                                            <div className="w-14 overflow-clip flex justify-center items-center">
                                                <img
                                                    src={`${BASE_URL}/products/resized/${doc?.image}`}
                                                    alt="img"
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                            <div className='flex flex-col items-start justify-center'>
                                                <h2 className='text-lg font-medium'>{doc?.name}</h2>
                                                <h2 className='text-xs font-normal'>{doc.quantity} x {doc.price}</h2>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='w-full p-6'>
                        <div className='w-full flex items-center justify-start p-4 rounded border'>
                            <div className='flex flex-col items-start'>
                                <h2 className='font-medium text-lg'>{order?.address?.fullName}</h2>
                                <h2 className='text-sm font-medium opacity-70 text-start'>{order?.address?.address}</h2>
                                <h2 className='text-sm font-medium opacity-70'>Phone : {order?.address?.phone}</h2>
                                <h2 className='text-sm font-medium opacity-70'>Email : {order?.address?.email}</h2>
                                <h2 className='text-sm font-medium opacity-70'>Order Notes : {order?.orderNote}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdminOrderStatusConfirmation open={confirmationDialog} status={currData?.status} handleBack={handleConfirmationBack} handleContinue={handleConfirmatioContinue}/>
        </>
    )
}

export default AdminOrderDetails