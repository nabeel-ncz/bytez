import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    IconButton,
    Card,
} from "@material-tailwind/react";
import { BASE_URL } from "../../constants/urls";

function CardZoom({image, offer}) {
    const [open, setOpen] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);

    const handleOpen = () => setOpen((cur) => !cur);
    const handleIsFavorite = () => setIsFavorite((cur) => !cur);
    return (
        <>
            <div className="w-64 lg:w-72 bg-transparent cursor-pointer overflow-hidden relative"
            onClick={handleOpen} >
                <img
                    alt="nature"
                    className="h-full w-full object-cover object-center"
                    src={`/images/dummy-product-1.webp`}
                />
                <div className="absolute top-1 left-1 font-bold text-sm bg-yellow-400 text-black px-3 py-1 rounded">
                    <h2>{offer}% off</h2>
                </div>
            </div>
            <Dialog size="md" open={open} handler={handleOpen}>
                <div className="w-full h-full flex items-center justify-center pb-14">
                    <img
                        alt="nature"
                        className="h-[32rem]"
                        src={`${BASE_URL}/products/resized/${image}`}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default CardZoom