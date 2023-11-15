import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function SalesByDate() {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']; 

    const firstData = [92, 84, 45, 74, 82, 90, 87];
    const secondData = [62, 94, 85, 64, 92, 70, 77];

    const NUMBER_CFG = { count: 7, min: -100, max: 100 };
    const generateRandomNumbers = ({ count, min, max }) => {
        console.log(Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min)))
        return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min));
    };

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Fully Rounded',
                data: generateRandomNumbers(NUMBER_CFG),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 2,
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false,
            },
            {
                label: 'Small Radius',
                data: generateRandomNumbers(NUMBER_CFG),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
            }
        ]
    };

    return (
        <div className='w-full px-24 py-4'>
            <Bar data={data} />
        </div>
    );
}

export default SalesByDate;