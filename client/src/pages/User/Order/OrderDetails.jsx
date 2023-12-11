import React, { useEffect, useState } from 'react'
import OrderStepper from '../../../components/Stepper/OrderStepper'
import OrderRejected from '../../../components/Stepper/OrderRejected';
import OrderCancelled from '../../../components/Stepper/OrderCancelled';
import { useParams } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import toast from 'react-hot-toast';
import CancelOrder from '../../../components/CustomDialog/CancelOrder';
import ReturnOrder from '../../../components/CustomDialog/ReturnOrder';
import OrderReturned from '../../../components/Stepper/OrderReturned';
import OrderReturnRejected from '../../../components/Stepper/OrderReturnRejected';
import CancelReturn from '../../../components/CustomDialog/CancelReturn';
import ReturnRequestCancelled from '../../../components/Stepper/ReturnRequestCancelled';
import CancelSingleProduct from '../../../components/CustomDialog/CancelSingleProduct';
import ReturnSingleProduct from '../../../components/CustomDialog/ReturnSingleProduct';
import DownloadInvoice from '../../../components/ExportFile/DownloadInvoice';
import { getAllUserOrdersApi } from '../../../services/api';
import { BASE_URL } from '../../../constants/urls';
import PageLoading from '../../../components/Loading/PageLoading';

function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState();
    const [activeStep, setActiveStep] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [returnCancelDialogOpen, setReturnCancelDialogOpen] = useState(false);
    const [singleCancelDialog, setSingleCancelDialog] = useState(false);
    const [singleReturnDialog, setSingleReturnDialog] = useState(false);
    const [singleCancelOrReturnData, setSingleCancelOrReturnData] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);

    useEffect(() => {
        setOrderLoading(true);
        handleFetchOrderDetails();
    }, []);

    const handleFetchOrderDetails = () => {
        getAllUserOrdersApi(id).then((response) => {
            if (response.data?.status === "ok") {
                setOrder(response?.data?.data);
                handleStep(response?.data?.data?.status);
            }
        }).finally(() => {
            setOrderLoading(false);
        })
    }

    const handleStep = (status) => {
        switch (status) {
            case "pending": setActiveStep(0);
                break;
            case "processing": setActiveStep(1);
                break;
            case "shipped": setActiveStep(2);
                break;
            case "delivered": setActiveStep(3);
                break;
            case "return requested": setActiveStep(1);
                break;
            case "request approved": setActiveStep(2);
                break;
            case "return recieved": setActiveStep(3);
                break;
            case "return accepted": setActiveStep(4);
                break;
            default:
                setActiveStep(0)
        }
    }

    const handleDialog = () => {
        setCancelDialogOpen(state => !state);
    }

    const handleReturnDialog = () => {
        setReturnDialogOpen(state => !state);
    }

    const handleReturnCancelDialog = () => {
        setReturnCancelDialogOpen(state => !state);
    }

    const handleCancelOrder = () => {
        if (order?.status === "shipped" || order?.status === "delivered") {
            toast.error("Order Cancel is not possible after shipping the order");
        } else {
            handleDialog();
        }
    }
    const handleReturnOrder = () => {
        handleReturnDialog();
    }

    const handleCancelSingleProduct = (productId, varientId) => {
        if (order?.status === "shipped" || order?.status === "delivered") {
            toast.error("Order Cancel is not possible after shipping the order");
        } else {
            setSingleCancelOrReturnData({
                orderId: order?._id,
                productId,
                varientId,
            });
            setSingleCancelDialog(true);
        }
    };

    const handleReturnSingleProduct = (productId, varientId) => {
        setSingleCancelOrReturnData({
            orderId: order?._id,
            productId,
            varientId,
        });
        setSingleReturnDialog(true);
    };

    return (
        <>
            {orderLoading ? <PageLoading /> : (
                <div className='w-full min-h-screen lg:px-24 px-4 py-4'>
                    <div className='flex flex-col items-center bg-white rounded shadow-sm'>
                        <div className='w-full p-6'>
                            <div className='w-full flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center justify-between bg-gray-100 p-4 rounded border'>
                                <div className='flex flex-col items-start'>
                                    <h2 className='font-medium text-base md:text-xl'>ODR{order?._id}</h2>
                                    <h2 className='text-xs font-normal text-start'>{order?.itemsQuantity} Products, Order Placed at {new Date(order?.createdAt).toLocaleString()}</h2>
                                </div>
                                <h2 className='font-medium text-xl'>₹ {order?.totalPrice}</h2>
                            </div>
                        </div>
                        {order?.status === "cancelled" ? (
                            <h2 className='text-start text-xs font-normal w-full px-6'>Order Cancelled At : {new Date(order?.cancelledAt).toLocaleString()}</h2>
                        ) : (order?.status.split(' ')[0] === "return" || order?.status.split(' ')[0] === "request") ? (
                            <h2 className='text-start text-xs font-normal w-full px-6'>Return requested At : {new Date(order?.returnRequestedAt).toLocaleString()}</h2>
                        ) : (
                            order?.status === "delivered" ? (
                                <h2 className='text-start text-xs font-normal w-full px-6'>Order Delivered At : {new Date(order?.deliveryDate).toLocaleString()}</h2>
                            ) : (
                                <h2 className='text-start text-xs font-normal w-full px-6'>Expected Order Delivery : {new Date(order?.deliveryDate).toLocaleString()}</h2>
                            )
                        )}
                        {order?.status === "rejected" ? (
                            <OrderRejected activeStep={1} />
                        ) : order?.status === "cancelled" ? (
                            <OrderCancelled activeStep={1} />
                        ) : order?.status === "return rejected" ? (
                            <OrderReturnRejected activeStep={2} />
                        ) : order?.status === "return cancelled" ? (
                            <ReturnRequestCancelled activeStep={2} />
                        ) : (order?.status.split(' ')[0] === "return" || order?.status.split(' ')[0] === "request") ? (
                            <OrderReturned activeStep={activeStep ? activeStep : 0} />
                        ) : (
                            <OrderStepper activeStep={activeStep ? activeStep : 0} />
                        )}
                        <div className='w-full p-6 mt-12 overflow-x-auto'>
                            <table className="w-full min-w-max table-auto">
                                <thead className="font-normal">
                                    <tr className="border-b border-gray-200">
                                        <th className="font-semibold ps-2 text-left border-r">No</th>
                                        <th className="font-semibold text-left border-r">Item</th>
                                        <th className="font-semibold text-left border-r"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order?.items?.map((doc, index) => (
                                        <tr key={doc._id} onClick={() => { }} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
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
                                            {order?.items?.length > 1 && (
                                                <td>
                                                    {(order?.status === "pending" || order?.status === "processing") && (
                                                        <div className='w-full flex flex-col items-end justify-end'>
                                                            <Button variant='outlined' size='sm' color='red' onClick={() => { handleCancelSingleProduct(doc.productId, doc.varientId) }}>Cancel Product</Button>
                                                        </div>
                                                    )}

                                                    {(((new Date().getTime() - new Date(order?.deliveryDate).getTime()) - (1000 * 3600 * 24)) <= 7) && (
                                                        (order?.status === "delivered") && (
                                                            <div className='w-full flex flex-col items-end justify-end'>
                                                                <Button variant='outlined' size='sm' color='red' onClick={() => { handleReturnSingleProduct(doc.productId, doc.varientId) }}>Return Product</Button>
                                                            </div>
                                                        )
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='w-full p-6 flex flex-col md:flex-row items-end justify-between'>
                            <div className='w-full md:w-1/2 flex items-center justify-start p-4 rounded border'>
                                <div className='flex flex-col items-start text-start'>
                                    <h2 className='font-medium text-lg'>{order?.address?.fullName}</h2>
                                    <h2 className='text-sm font-medium opacity-70'>{order?.address?.address}</h2>
                                    <h2 className='text-sm font-medium opacity-70'>Phone : {order?.address?.phone}</h2>
                                    <h2 className='text-sm font-medium opacity-70'>Email : {order?.address?.email}</h2>
                                    <h2 className='text-sm font-medium opacity-70'>Order Notes : {order?.orderNote}</h2>
                                </div>
                            </div>
                            <div className='w-full md:w-1/2 flex items-center justify-start p-4 rounded border'>
                                {(order?.status === "pending" || order?.status === "processing") && (
                                    <div className='w-full flex flex-col items-end justify-end'>
                                        <Button variant='outlined' color='red' onClick={handleCancelOrder}>Cancel Order</Button>
                                    </div>
                                )}

                                {(((new Date().getTime() - new Date(order?.deliveryDate).getTime()) - (1000 * 3600 * 24)) <= 7) && (
                                    (order?.status === "delivered") && (
                                        <div className='w-full flex flex-col items-end justify-end'>
                                            <Button variant='outlined' color='red' onClick={handleReturnOrder}>Send Return Request</Button>
                                        </div>
                                    )
                                )}

                                {(order?.status === "return requested") && (
                                    <div className='w-full flex flex-col items-end justify-end'>
                                        <Button variant='outlined' color='red' onClick={handleReturnCancelDialog}>Cancel Return Request</Button>
                                    </div>
                                )}
                                {(order?.status !== "pending" && order?.status !== "processing" && order?.status !== "shipped" && order?.status !== "cancelled" && order?.status !== "rejected") && (
                                    <DownloadInvoice orderId={order?._id || null} />
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            )}
            <CancelOrder open={cancelDialogOpen} handleOpen={handleDialog} orderId={order?._id} handleFetchOrderDetails={handleFetchOrderDetails} />
            <ReturnOrder open={returnDialogOpen} handleOpen={handleReturnDialog} orderId={order?._id} handleFetchOrderDetails={handleFetchOrderDetails} />
            <CancelReturn open={returnCancelDialogOpen} handleOpen={handleReturnCancelDialog} orderId={order?._id} handleFetchOrderDetails={handleFetchOrderDetails} />
            <CancelSingleProduct open={singleCancelDialog} handleOpen={() => { setSingleCancelDialog(state => !state) }} data={singleCancelOrReturnData} clearData={() => { setSingleCancelOrReturnData(null) }} handleFetchOrderDetails={handleFetchOrderDetails} />
            <ReturnSingleProduct open={singleReturnDialog} handleOpen={() => { setSingleReturnDialog(state => !state) }} data={singleCancelOrReturnData} clearData={() => { setSingleCancelOrReturnData(null) }} handleFetchOrderDetails={handleFetchOrderDetails} />
        </>
    )
}

export default OrderDetails