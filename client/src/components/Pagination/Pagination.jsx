import React, { useState } from "react";
import { IconButton, Typography } from "@material-tailwind/react";

function Pagination({ total, next, prev, active }) {
    return (
        <div className="flex items-center gap-8">
            <IconButton
                size="sm"
                variant="outlined"
                onClick={prev}
                disabled={active === 1}
            >
                <img src="/icons/arrow-left-icon.png" alt="" className="w-4 -rotate-180"/>
            </IconButton>
            <Typography color="gray" className="font-normal">
                Page <strong className="text-gray-900">{active}</strong> of{" "}
                <strong className="text-gray-900">{total}</strong>
            </Typography>
            <IconButton
                size="sm"
                variant="outlined"
                onClick={next}
                disabled={active === total}
            >   
                <img src="/icons/arrow-left-icon.png" alt="" className="w-4"/>
            </IconButton>
        </div>
    )
}

export default Pagination

