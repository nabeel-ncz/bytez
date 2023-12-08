import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { Tab, Tabs, TabsHeader } from '@material-tailwind/react';
import { getSalesReportInAdminApi } from '../../services/api';

function SalesByDate() {
    const [labels, setLabels] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [period, setPeriod] = useState("daily")

    useEffect(() => {
        getSalesReportInAdminApi(period).then((response) => {
            if (response.data?.status === "ok") {
                const labelsTemp = response.data?.data?.map((doc) => doc.date);
                const dataTemp = response.data?.data?.map((doc) => doc.totalSales);
                setLabels(labelsTemp);
                setGraphData(dataTemp);
            }
        });
    }, [period])

    const data = {
        labels: labels,
        datasets: [
            {
                label: `${period} sales report`,
                data: graphData,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
            }
        ]
    };

    return (
        <div className='w-full px-24 py-4 bg-white'>
            <div className='flex items-center justify-start py-4'>
                <Tabs className="flex items-start gap-2">
                    <TabsHeader
                        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                        indicatorProps={{
                            className:
                                "bg-gray-200 border-b-2 border-gray-900 shadow-none rounded-none",
                        }}
                    >
                        <Tab onClick={() => { setPeriod("daily") }} className='px-6'>Daily</Tab>
                        <Tab onClick={() => { setPeriod("monthly") }} value={"monthly"} className='px-6'>Monthly</Tab>
                        <Tab onClick={() => { setPeriod("yearly") }} value={"yearly"} className='px-6'>Yearly</Tab>
                    </TabsHeader>
                </Tabs>
            </div>
            <Bar data={data} />
        </div>
    );
}

export default SalesByDate;