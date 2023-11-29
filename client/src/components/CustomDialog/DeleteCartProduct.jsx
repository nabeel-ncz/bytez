import React from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { deleteProductFromCart, getAllCartProducts } from '../../store/actions/user/userActions';
import toast from 'react-hot-toast';

function DeleteCartProduct({ open, handleOpen, userId, deleteId, setDeleteId, openCouponRemoveDialog }) {
    const dispatch = useDispatch();

    const handleProductDelete = () => {
        dispatch(deleteProductFromCart({
            userId: userId,
            varientId: deleteId,
        })).then((response) => {
            console.log(response)
            if (response?.payload?.status == "ok") {
                setDeleteId(null);
                dispatch(getAllCartProducts(userId)).then(() => {
                    handleOpen();
                })
            } else if (response?.payload?.status === "coupon_cannot_applicable") {
                handleOpen();
                openCouponRemoveDialog();
            }
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