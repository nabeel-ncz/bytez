import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";

function OrderSuccessfull({open, handleOpen}) {
    const navigate = useNavigate();
    return (
        <>
            <Dialog open={open} data-dialog-backdrop-close="false">
                <DialogHeader>Order Placed Successfully!</DialogHeader>
                <DialogBody>
                Thank you for shopping with us. Your order has been received and is now being processed.
                Estimated delivery date: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outlined"
                        color="gray"
                        onClick={() => { navigate(`/`) }}
                        className="mr-1"
                    >
                        <span>Back</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={() => {
                        navigate(`/orders`)
                    }}>
                        <span>Go To Orders</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default OrderSuccessfull;