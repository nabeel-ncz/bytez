import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    IconButton,
    Card,
} from "@material-tailwind/react";

function CardZoom({image}) {
    const [open, setOpen] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);

    const handleOpen = () => setOpen((cur) => !cur);
    const handleIsFavorite = () => setIsFavorite((cur) => !cur);
    return (
        <>
            <div className="w-96 bg-transparent cursor-pointer overflow-hidden"
            onClick={handleOpen} >
                <img
                    alt="nature"
                    className="h-full w-full object-cover object-center"
                    src={`http://localhost:3000/products/resized/${image}`}
                />
            </div>
            <Dialog size="md" open={open} handler={handleOpen}>
                <div className="w-full h-full flex items-center justify-center pb-14">
                    <img
                        alt="nature"
                        className="h-[32rem]"
                        src={`http://localhost:3000/products/resized/${image}`}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default CardZoom