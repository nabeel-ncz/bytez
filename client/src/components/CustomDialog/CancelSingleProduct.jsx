import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../../constants/urls';

function CancelSingleProduct({ open, handleOpen, data, handleFetchOrderDetails, clearData }) {
    const dispatch = useDispatch();
    const [cancelReason, setCancelReason] = useState("Decided not to proceed with the purchase.");
    const [reasonInput, setReasonInput] = useState("")
    const [error, setError] = useState(null);

    useEffect(() => {
        setCancelReason("Decided not to proceed with the purchase.")
        setError(null);
    }, []);

    const cancelOrder = (cancelReason) => {
        axios.put(`${BASE_URL}/api/user/order/cancel_single`, { ...data, cancelReason }, { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                handleFetchOrderDetails();
                toast.success("Order is successfully cancelled!");
                handleOpen();
            } else if (response.data?.status === 'error') {
                handleFetchOrderDetails();
                toast.error(response.data?.message);
                handleOpen();
            } else {
                handleFetchOrderDetails();
                toast.error("There is something went wrong in the cancellation of the order!");
                handleOpen();
            }
        }).finally(() => {
            clearData();
        })
    }

    const handleCancelSubmit = () => {
        if (cancelReason === "Other") {
            if (reasonInput.split(" ").length < 3) {
                setError("Please write the reason, reason should contian atleast 3 words!")
            } else {
                setError("");
                cancelOrder(reasonInput);
            }
        } else {
            cancelOrder(cancelReason);
        }
    };

    const handleCancelReason = (event) => {
        setCancelReason(event.target.value);
    }

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Cancel Order</DialogHeader>
                <DialogBody>
                    <h2 className='text-base font-medium'>Are you sure you want to cancel the order?</h2>
                    <h2 className='text-base font-medium mb-2'>Please Enter the reason for the cancelation here..</h2>
                    {cancelReason === "Other" ? (
                        <>
                            <input className='outline-none border border-gray-600 px-4 py-2 w-full' type="text" value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} placeholder='Write the cancel reason here...' id='cancel_reason' />
                            {error && <h2 className='text-xs font-semibold text-red-800'>{error}</h2>}
                        </>
                    ) : (
                        <select className='w-full p-4 text-sm font-medium outline-none border border-gray-600' name="" id="" value={cancelReason} onChange={handleCancelReason}>
                            <option value="Decided not to proceed with the purchase.">Decided not to proceed with the purchase.</option>
                            <option value="Discovered a more attractive offer elsewhere.">Discovered a more attractive offer elsewhere.</option>
                            <option value="No longer require the product.">No longer require the product.</option>
                            <option value="Accidentally placed the order.">Accidentally placed the order.</option>
                            <option value="Shifted to a new address or location.">Shifted to a new address or location.</option>
                            <option value="Other">Other</option>
                        </select>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outlined"
                        color="gray"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Back</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleCancelSubmit}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
export default CancelSingleProduct;