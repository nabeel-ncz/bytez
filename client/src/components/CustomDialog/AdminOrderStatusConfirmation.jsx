import React from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

function AdminOrderStatusConfirmation({ open, handleBack, handleContinue, status }) {
    return (
        <>
            <Dialog open={open} handler={handleBack}>
                <DialogHeader>CHANGE TO <h2 className='uppercase ms-2'>{status}</h2></DialogHeader>
                <DialogBody>
                  <h1 className='text-lg font-semibold'>Are you sure you want to change this order status to {status} ? This action cannot be undone!.</h1>  
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outlined"
                        color="gray"
                        onClick={handleBack}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="blue" onClick={handleContinue}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default AdminOrderStatusConfirmation;