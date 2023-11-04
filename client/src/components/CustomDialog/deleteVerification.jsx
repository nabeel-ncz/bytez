import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { deleteProduct } from '../../store/actions/admin/adminActions';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

function deleteVerification({ open, handleOpen, deleteId, handleAfterDeletion }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        console.log('working', deleteId);
        dispatch(deleteProduct({ productId: deleteId.productId, varientId: deleteId.varientId })).then((result) => {
            console.log(result);
            toast.success("Product Deleted successfully!");
            if(result?.payload === null){
                handleAfterDeletion(result?.payload);
                navigate('/admin/products');
            } else {
                handleAfterDeletion(result?.payload);
            }
            handleOpen();
        }).catch(() => {
            toast.error("There is something went wrong, Please try again later!");
            handleOpen();
        })
    }
    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Product Delete Verification</DialogHeader>
                <DialogBody>
                    Are you sure you want to delete this product? This action cannot be undone.
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

export default deleteVerification;