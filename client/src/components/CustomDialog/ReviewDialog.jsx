import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Rating,
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { addProductReview, getAllProductReviews, getReview, updateProductReview } from '../../store/actions/user/userActions';

function ReviewDigalog({ open, handleOpen, productId, userId, update, reviewId }) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(3);
    const [error, setError] = useState(null)

    const dispatch = useDispatch();

    const handleReviewSubmit = () => {
        if (comment.trim().length < 5) {
            setError("Comment is too short!");
        } else {
            if (update) {
                dispatch(updateProductReview({
                    id: reviewId,
                    productId,
                    userId,
                    comment,
                    rating
                })).then(() => {
                    dispatch(getAllProductReviews(productId)).then(() => {
                        handleOpen();
                    })
                })
            } else {
                dispatch(addProductReview({
                    productId,
                    userId,
                    comment,
                    rating
                })).then(() => {
                    dispatch(getAllProductReviews(productId)).then(() => {
                        handleOpen();
                    })
                })
            }
            setError(null);
        }
    };

    useEffect(() => {
        console.log(update)
        if (update) {
            dispatch(getReview(reviewId)).then((response) => {
                if (response?.payload?.status === "ok") {
                    setComment(response?.payload?.data?.comment);
                    setRating(response?.payload?.data?.rating);
                }
            })
        }
    }, [update]);

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Write product review</DialogHeader>
                <DialogBody>
                    <div className='flex flex-col items-start justify-center gap-1'>
                        <label htmlFor="input-1">Rating : </label>
                        <Rating value={rating} onChange={(value) => { setRating(value) }} />
                        <label htmlFor="input-1">Comment : </label>
                        <input type="text" id='input-1' value={comment} onChange={(evt) => { setComment(evt.target.value) }} placeholder='Write your comment here...'
                            className='w-full px-2 py-2 outline-none focus:outline-none border border-gray-800' />
                        {error && (<h2 className='text-xs font-medium text-red-700'>{error}</h2>)}
                    </div>
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
                    <Button variant="gradient" color="yellow" onClick={handleReviewSubmit}>
                        <span>Save</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
export default ReviewDigalog;