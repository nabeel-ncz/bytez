import React, { useEffect, useState } from 'react'
import OrderStepper from '../../../components/Stepper/OrderStepper'
import OrderRejected from '../../../components/Stepper/OrderRejected';
import OrderCancelled from '../../../components/Stepper/OrderCancelled';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@material-tailwind/react';
import toast from 'react-hot-toast';

function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState();
    const [activeStep, setActiveStep] = useState(null);

    useEffect(() => {
        handleFetchOrderDetails();
    }, []);
    const handleFetchOrderDetails = () => {
        axios.get(`http://localhost:3000/user/order/find/${id}`, { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                setOrder(response?.data?.data);
            }
        }).finally(() => {
            handleStep();
        })
    }

    const handleStep = () => {
        switch (order?.status) {
            case "pending": setActiveStep(0);
                break;
            case "processing": setActiveStep(1);
                break;
            case "shipped": setActiveStep(2);
                break;
            case "delivered": setActiveStep(3);
                break;
            default:
                setActiveStep(0)
        }
    }
    const handleCancelOrder = () => {
        if (order?.status === "shipped" || order?.status === "delivered") {
            toast.error("Order Cancel is not possible after shipping the order");
        } else {
            // axios.patch(`http://localhost:3000/user/order/cancel/${order._id}`, {}, { withCredentials: true }).then((response) => {
            //     if (response.data?.status === "ok") {
            //         handleFetchOrderDetails();
            //         toast.success("Order is successfully cancelled!");
            //     } else {
            //         toast.error("There is something went wrong in the cancel order!");
            //     }
            // })
        }
    }

    return (
        <div className='w-full min-h-screen px-24 py-4'>
            <div className='flex flex-col items-center bg-white rounded shadow-sm'>
                <div className='w-full p-6'>
                    <div className='w-full flex items-center justify-between bg-gray-100 p-4 rounded border'>
                        <div className='flex flex-col items-start'>
                            <h2 className='font-medium text-xl'>{order?._id}</h2>
                            <h2 className='text-xs font-normal'>{order?.itemsQuantity} Products, Order Placed at {new Date(order?.createdAt).toLocaleString()}</h2>
                        </div>
                        <h2 className='font-medium text-xl'>₹ {order?.totalPrice}</h2>
                    </div>
                </div>
                <h2 className='text-start text-xs font-normal w-full px-6'>Expected Order Delivery {new Date(order?.deliveryDate).toLocaleString()}</h2>
                {order?.status === "rejected" ? (
                    <OrderRejected activeStep={1} />
                ) : order?.status === "cancelled" ? (
                    <OrderCancelled activeStep={1} />
                ) : (
                    <OrderStepper activeStep={activeStep ? activeStep : 0} />
                )}
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
                                <tr key={doc._id} onClick={() => { }} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                                    <td className="text-sm ps-2 text-start border-r">{index + 1}</td>
                                    <td className="text-sm flex items-center gap-2 text-start border-r">
                                        <div className="w-14 overflow-clip flex justify-center items-center">
                                            <img
                                                src={`http://localhost:3000/products/resized/${doc?.image}`}
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
                <div className='w-full p-6 flex items-end justify-between'>
                    <div className='w-1/2 flex items-center justify-start p-4 rounded border'>
                        <div className='flex flex-col items-start'>
                            <h2 className='font-medium text-lg'>{order?.address?.fullName}</h2>
                            <h2 className='text-sm font-medium opacity-70'>{order?.address?.address}</h2>
                            <h2 className='text-sm font-medium opacity-70'>Phone : {order?.address?.phone}</h2>
                            <h2 className='text-sm font-medium opacity-70'>Email : {order?.address?.email}</h2>
                            <h2 className='text-sm font-medium opacity-70'>Order Notes : {order?.orderNote}</h2>
                        </div>
                    </div>
                    <div className='w-1/2 flex items-center justify-start p-4 rounded border'>
                        <div className='w-full flex flex-col items-end justify-end'>
                            <Button variant='outlined' color='red' onClick={handleCancelOrder}>Cancel Order</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OrderDetails