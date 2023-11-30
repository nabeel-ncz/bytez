import React, { useEffect, useState } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";

function OrderReturned({ activeStep }) {
    return (
        <div className="w-full px-36 py-4">
            <Stepper activeStep={activeStep} lineClassName="bg-orange-100" activeLineClassName="bg-green-400">
                <Step className="!bg-white">
                    <img src="/icons/delivered.png" alt="" className="w-20" />
                    <div className="absolute -bottom-[2rem] w-max text-center">
                        <h2 className={`text-sm font-semibold ${activeStep >= 0 ? "text-black" : "text-gray-600"}`}>Order Delivered</h2>
                    </div>
                </Step>
                <Step className="!bg-white">
                    <img src="/icons/email.png" alt="" className="w-20" />
                    <div className="absolute -bottom-[2rem] w-max text-center">
                        <h2 className={`text-sm font-semibold ${activeStep >= 1 ? "text-black" : "text-gray-600"}`}>Return Requested</h2>
                    </div>
                </Step>
                <Step className="!bg-white">
                    <img src="/icons/checked.png" alt="" className="w-20" />
                    <div className="absolute -bottom-[2rem] w-max text-center">
                        <h2 className={`text-sm font-semibold ${activeStep >= 2 ? "text-black" : "text-gray-600"}`}>Request Approved</h2>
                    </div>
                </Step>
                <Step className="!bg-white">
                    <img src="/icons/courier.png" alt="" className="w-20" />
                    <div className="absolute -bottom-[2rem] w-max text-center">
                        <h2 className={`text-sm font-semibold ${activeStep >= 3 ? "text-black" : "text-gray-600"}`}>Products Recieved</h2>
                    </div>
                </Step>
                <Step className="!bg-white">
                    <img src="/icons/cashback.png" alt="" className="w-20" />
                    <div className="absolute -bottom-[2rem] w-max text-center">
                        <h2 className={`text-sm font-semibold ${activeStep >= 4 ? "text-black" : "text-gray-600"}`}>Amount Refunded</h2>
                    </div>
                </Step>
            </Stepper>
        </div>
    );
}

export default OrderReturned;