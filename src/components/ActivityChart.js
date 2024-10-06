import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

// Constants for chart colors
const LOGIN_COLOR = 'rgba(75, 192, 192, 0.6)';
const LOGOUT_COLOR = 'rgba(255, 99, 132, 0.6)';

const ActivityChart = ({ activities }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const loginLogoutCounts = activities.reduce((acc, activity) => {
            const date = new Date(activity.timestamp).toLocaleDateString();
            acc[date] = acc[date] || { login: 0, logout: 0 };

            if (activity.activityType === 'login') acc[date].login++;
            if (activity.activityType === 'logout') acc[date].logout++;

            return acc;
        }, {});

        const labels = Object.keys(loginLogoutCounts);
        const data = {
            labels,
            datasets: [
                {
                    label: 'Logins',
                    data: labels.map((date) => loginLogoutCounts[date].login),
                    backgroundColor: LOGIN_COLOR,
                },
                {
                    label: 'Logouts',
                    data: labels.map((date) => loginLogoutCounts[date].logout),
                    backgroundColor: LOGOUT_COLOR,
                },
            ],
        };

        if (canvasRef.current) {
            if (chartRef.current) {
                chartRef.current.destroy(); // Destroy the previous chart instance
            }

            chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
                type: 'bar',
                data,
            });
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy(); // Cleanup on unmount
            }
        };
    }, [activities]);

    return <canvas ref={canvasRef} />;
};

export default ActivityChart;
