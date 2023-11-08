import React from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { deleteProductFromCart } from '../../store/actions/user/userActions';

function DeleteCartProduct({ open, handleOpen, userId, deleteId, setDeleteId,  }) {
    const dispatch = useDispatch();

    const handleProductDelete = () => {
        dispatch(deleteProductFromCart({
            userId: userId,
            varientId: deleteId,
        })).then(() => {
            setDeleteId(null);
            handleOpen();
        })
    }

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogBody>
                    <h2 className='text-lg'>Are you sure you want to remove this product from your cart ? This action cannot be undone.</h2>
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
                    <Button variant="gradient" color="red" onClick={handleProductDelete}>
                        <span>Delete</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default DeleteCartProduct;