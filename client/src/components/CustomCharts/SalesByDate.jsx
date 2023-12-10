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
                let labelsTemp = response.data?.data?.map((doc) => doc.date);
                if (period === "daily") {
                    labelsTemp = response.data?.data?.map((doc) => doc.date.split('-')[2]);
                }
                const dataTemp = response.data?.data?.map((doc) => doc.totalSales);
                setLabels(labelsTemp);
                setGraphData(dataTemp);
            }
        });
    }, [period])

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: false,
        scales: {
            x: {
                border: {
                    display: true
                },
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                }
            },
            y: {
                border: {
                    display: false
                },
                grid: {
                    color: function (context) {
                        if (context.tick.value > 0) {
                            return "#FFFFFF";
                        } else if (context.tick.value < 0) {
                            return "#FFFFFF";
                        }

                        return '#000000';
                    },
                },
            }
        }
    }

    const data = {
        labels: labels,
        options: chartOptions,
        datasets: [
            {
                label: `${period} sales report`,
                data: graphData,
                borderColor: 'rgb(255, 215, 0)',
                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
            }
        ],

    };


    return (
        <div className='w-full px-8 lg:px-24 py-4 bg-white overflow-x-auto' >
            <div className='flex items-center justify-start py-4'>
                <Tabs className="flex items-start gap-2">
                    <TabsHeader
                        className="rounded-none border-b border-yellow-300 bg-transparent p-0"
                        indicatorProps={{
                            className:
                                "bg-yellow-50 border-b-2 border-yellow-500 shadow-none rounded-none",
                        }}
                    >
                        <Tab onClick={() => { setPeriod("daily") }} className='px-6'>Daily</Tab>
                        <Tab onClick={() => { setPeriod("monthly") }} value={"monthly"} className='px-6'>Monthly</Tab>
                        <Tab onClick={() => { setPeriod("yearly") }} value={"yearly"} className='px-6'>Yearly</Tab>
                    </TabsHeader>
                </Tabs>
            </div>

            <Bar data={data} options={chartOptions} width={"1000"} height={"500"} />

        </div >
    );
}

export default SalesByDate;