import React from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { deleteAddress, getAllAddresses } from '../../store/actions/user/userActions';

function DeleteAddress({ open, handleOpen, userId, addressId  }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteAddress({
            userId,
            addressId,
        })).then(() => {
            dispatch(getAllAddresses(userId));
        });
        handleOpen();
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogBody>
                    <h2 className='text-lg'>Are you sure you want to remove this address from your profile ? This action cannot be undone.</h2>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outlined"
                        color="gray"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleDelete}>
                        <span>Delete</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default DeleteAddress;