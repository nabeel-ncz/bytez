import React, { useEffect, useState } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";

function OrderReturnRejected({ activeStep }) {
    
    return (
        <div className="w-full px-36 py-4">
            <Stepper activeStep={activeStep} lineClassName="bg-orange-100" activeLineClassName="bg-red-400">
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
                    <img src="/icons/rejected.png" alt="" className="w-20" />
                    <div className="absolute -bottom-[2rem] w-max text-center">
                        <h2 className={`text-sm font-semibold ${activeStep >= 2 ? "text-black" : "text-gray-600"}`}>Return Rejected</h2>
                    </div>
                </Step>
            </Stepper>
        </div>
    );
}

export default OrderReturnRejected;