import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

// Constant for line color
const ACTIVE_USERS_COLOR = 'rgba(153, 102, 255, 0.6)';

const ActiveSessionsChart = ({ activities }) => {
    const canvasRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const sessions = activities.reduce((acc, activity) => {
            const time = new Date(activity.timestamp).toLocaleTimeString();
            acc[time] = acc[time] || 0;

            if (activity.activityType === 'login') {
                acc[time]++;
            } else if (activity.activityType === 'logout') {
                acc[time]--;
            }

            return acc;
        }, {});

        const data = {
            labels: Object.keys(sessions),
            datasets: [
                {
                    label: 'Active Users',
                    data: Object.values(sessions),
                    fill: false,
                    borderColor: ACTIVE_USERS_COLOR,
                    tension: 0.1,
                },
            ],
        };

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy(); // Destroy previous instance
        }

        chartInstanceRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data,
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy(); // Cleanup on unmount
            }
        };
    }, [activities]);

    return <canvas ref={canvasRef}></canvas>;
};

export default ActiveSessionsChart;
