import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

// Constants for background colors
const BACKGROUND_COLORS = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 205, 86, 0.6)',
];

const PageVisitChart = ({ activities }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const pageVisitCounts = activities.reduce((acc, activity) => {
            if (activity.activityType === 'pageVisit') {
                acc[activity.page] = (acc[activity.page] || 0) + 1;
            }
            return acc;
        }, {});

        const labels = Object.keys(pageVisitCounts);
        const data = {
            labels,
            datasets: [
                {
                    label: 'Page Visits',
                    data: Object.values(pageVisitCounts),
                    backgroundColor: BACKGROUND_COLORS.slice(0, labels.length),
                },
            ],
        };

        if (canvasRef.current) {
            if (chartRef.current) {
                chartRef.current.destroy(); // Destroy existing chart if present
            }

            chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
                type: 'pie',
                data,
            });
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy(); // Cleanup on component unmount
            }
        };
    }, [activities]);

    return <canvas ref={canvasRef} />;
};

export default PageVisitChart;
