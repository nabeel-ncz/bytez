import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../constants/urls';

function ReturnOrder({ open, handleOpen, orderId, handleFetchOrderDetails }) {
    const [returnReason, setReturnReason] = useState("Product did not meet expectations.");
    const [reasonInput, setReasonInput] = useState("")
    const [error, setError] = useState(null);

    useEffect(() => {
        setReturnReason("Product did not meet expectations.");
        setError(null);
    }, []);

    const returnOrder = (reason) => {
        axios.patch(`${BASE_URL}/api/user/order/return`, { reason, orderId }, { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                handleFetchOrderDetails();
                toast.success("Return request is successfully sended!");
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
        })
    }

    const handleReturnSubmit = () => {
        if (returnReason === "Other") {
            if (reasonInput.split(" ").length < 3) {
                setError("Please write the reason, Reason should contian atleast 3 words!")
            } else {
                setError("");
                returnOrder(reasonInput);
            }
        } else {
            returnOrder(returnReason);
        }
    }
    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Return Order</DialogHeader>
                <DialogBody>
                    <h2 className='text-base font-medium'>Are you sure you want to return the order?</h2>
                    <h2 className='text-base font-medium mb-2'>Please Enter the reason for returning the order</h2>
                    {returnReason === "Other" ? (
                        <>
                            <input className='outline-none border border-gray-600 px-4 py-2 w-full' type="text" value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} placeholder='Write the return reason here...' />
                            {error && <h2 className='text-xs font-semibold text-red-800'>{error}</h2>}
                        </>
                    ) : (
                        <select className='w-full p-4 text-sm font-medium outline-none border border-gray-600' name="" id="" value={returnReason} onChange={(e) => setReturnReason(e.target.value)}>
                            <option value="Product did not meet expectations.">Product did not meet expectations.</option>
                            <option value="Received a damaged or defective item.">Received a damaged or defective item.</option>
                            <option value="Size or fit is not as expected.">Size or fit is not as expected.</option>
                            <option value="Changed my mind about the purchase.">Changed my mind about the purchase.</option>
                            <option value="Received the wrong product.">Received the wrong product.</option>
                            <option value="Quality of the product is not satisfactory.">Quality of the product is not satisfactory.</option>
                            <option value="Found a better deal elsewhere.">Found a better deal elsewhere.</option>
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
                    <Button variant="gradient" color="red" onClick={handleReturnSubmit}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
export default ReturnOrder;