import React from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { removeCouponFromCart, getAllCartProducts } from '../../store/actions/user/userActions';
import toast from 'react-hot-toast';

function RemoveCouponFromCart({ open, handleOpen, cartId, userId, handleCouponStatus }) {
    const dispatch = useDispatch();

    const handleProductDelete = () => {
        dispatch(removeCouponFromCart({
            cartId,
            userId
        })).then((response) => {
            dispatch(getAllCartProducts(userId)).then(() => {
                if (response?.payload?.status === "ok") {
                    handleCouponStatus('not_applied')
                    handleOpen();
                    toast.success("The coupon removed from your cart successfully!");
                }
            })
        })
    }

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogBody>
                    <h2 className='text-lg'>Are you sure you want to remove the coupon from your cart ?</h2>
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
                    <Button variant="gradient" color="blue" onClick={handleProductDelete}>
                        <span>Sure</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default RemoveCouponFromCart;