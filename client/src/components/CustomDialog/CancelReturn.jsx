import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import toast from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../../constants/urls';

function CancelReturn({ open, handleOpen, orderId, handleFetchOrderDetails }) {

    const handleSubmit = () => {
        axios.patch(`${BASE_URL}/api/user/order/return/cancel`, { orderId }, { withCredentials: true }).then((response) => {
            if (response.data?.status === "ok") {
                handleFetchOrderDetails();
                toast.success("Return request is successfully cancelled!");
                handleOpen();
            } else if (response.data?.status === 'error') {
                handleFetchOrderDetails();
                toast.error(response.data?.message);
                handleOpen();
            } else {
                handleFetchOrderDetails();
                toast.error("There is something went wrong in the cancellation of the return request!");
                handleOpen();
            }
        });
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Cancel Return Request</DialogHeader>
                <DialogBody>
                    <h2 className='text-lg font-semibold'>Are you sure you want to cancel the Return request ?</h2>
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
                    <Button variant="gradient" color="red" onClick={handleSubmit}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
export default CancelReturn;