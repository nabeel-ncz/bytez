import React, { useEffect, useState } from 'react';
import { getSalesReportByBrandInAdminApi } from '../../services/api';


function SalesByBrand({ id, brand }) {
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        getSalesReportByBrandInAdminApi(id).then((response) => {
            if (response.data?.status === "ok") {
                setAmount(response.data?.data);
            };
        });
    }, []);

    return (
        <div className='bg-white shadow-md rounded-md p-4 lg:p-8'>
            <div className='flex items-center justify-between gap-4'>
                <img src="/icons/sales-report.png" alt="" className='w-8 lg:w-16' />
                <div className='flex flex-col items-start justify-center gap-1'>
                    <h2 className='font-bold text-base lg:text-xl'>{brand}</h2>
                    <h1 className='font-bold text-xl lg:text-4xl'>₹.{amount}</h1>
                </div>
            </div>

        </div>
    );
}

export default SalesByBrand;