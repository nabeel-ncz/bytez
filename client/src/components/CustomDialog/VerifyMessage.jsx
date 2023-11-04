import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";

function VerifyMessage({open, handleOpen, email}) {
    const navigate = useNavigate();
    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Thank you for signing up!</DialogHeader>
                <DialogBody>
                    Please note that your account and data are temporary and
                    will be deleted if you don't verify your email within 3 days.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>later</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={() => {
                        navigate(`/verify/email?request=true&email=${email}`)
                    }}>
                        <span>Verify Now</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default VerifyMessage