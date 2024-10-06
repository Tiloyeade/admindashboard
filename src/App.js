import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ActivityChart from './components/ActivityChart';
import PageVisitChart from './components/PageVisitChart';
import ActiveSessionsChart from './components/ActiveSessionsChart';
import ErrorBoundary from './components/ErrorBoundary';

// Constants
const SOCKET_URL = 'https://dashboardbackend-rkqp.onrender.com';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Establish socket connection to listen for user activity
    const socket = io(SOCKET_URL);

    socket.on('userActivity', (activity) => {
      console.log('Received activity:', activity); // Log received activity
      if (activity) {
        setActivities((prevActivities) => [activity, ...prevActivities]);
      }
    });

    return () => {
      socket.off('userActivity');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Real-Time Admin Dashboard</h1>

        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <ActivityChart activities={activities} />
            </div>
            <div className="col-span-1">
              <ActiveSessionsChart activities={activities} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <PageVisitChart activities={activities} />
            </div>
          </div>
        </ErrorBoundary>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Recent Activities</h2>
          <div className="overflow-y-auto max-h-64">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <p key={index} className="text-sm text-gray-700 mb-1">
                  {activity.userId} performed {activity.activityType} on{' '}
                  {activity.page || 'unknown page'} at{' '}
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-700 mb-1">No recent activities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
