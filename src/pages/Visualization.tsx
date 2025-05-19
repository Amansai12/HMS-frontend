import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  
} from 'chart.js';
import { Line, Bar,Doughnut } from 'react-chartjs-2';
import { BACKEND_URL } from '@/lib/config';
import { Loader } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define types for our dashboard data
interface AttendanceTrend {
  date: string;
  inCampus: number;
  outing: number;
  leave: number;
}

interface HostelOccupancy {
  hostelName: string;
  occupiedRooms: number;
  totalRooms: number;
}

interface OutpassStatistics {
  day: string;
  count: number;
}

interface AttendanceTypeDistribution {
  inCampus: number;
  outing: number;
  leave: number;
}

interface CriticalPointsDistribution {
  range: string;
  count: number;
}

interface DashboardData {
  attendanceTrends: AttendanceTrend[];
  hostelOccupancy: HostelOccupancy[];
  outpassStatistics: OutpassStatistics[];
  currentAttendanceDistribution: AttendanceTypeDistribution;
  criticalPointsDistribution: CriticalPointsDistribution[];
}

const Visualization: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/dashboard`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh dashboard every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
    <div className="flex justify-center items-center h-[80vh] flex-col gap-1">
        <Loader size={40} className='animate-spin' />
        <p className='text-center font-semibold text-gray-700'>Creating visualizations for you</p>
        <p className='text-center font-semibold text-gray-700'>please wait...</p>
        .</div>);
  }

  if (error || !dashboardData) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      Error loading dashboard: {error || 'No data received'}
    </div>;
  }

  // Prepare data for the attendance trends chart
  const attendanceTrendsData = {
    labels: dashboardData.attendanceTrends.map(trend => trend.date),
    datasets: [
      {
        label: 'In Campus',
        data: dashboardData.attendanceTrends.map(trend => trend.inCampus),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Outing',
        data: dashboardData.attendanceTrends.map(trend => trend.outing),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Leave',
        data: dashboardData.attendanceTrends.map(trend => trend.leave),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const attendanceTrendsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Attendance Trends (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Students',
        },
      },
    },
  };

  // Prepare data for the hostel occupancy chart
  const hostelOccupancyData = {
    labels: dashboardData.hostelOccupancy.map(hostel => hostel.hostelName),
    datasets: [
      {
        label: 'Occupied Rooms',
        data: dashboardData.hostelOccupancy.map(hostel => hostel.occupiedRooms),
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
      },
      {
        label: 'Total Rooms',
        data: dashboardData.hostelOccupancy.map(hostel => hostel.totalRooms),
        backgroundColor: 'rgba(53, 162, 235, 0.3)',
      },
    ],
  };

  const hostelOccupancyOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Hostel Occupancy',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Rooms',
        },
      },
    },
  };

  // Prepare data for the outpass statistics chart
  const outpassStatisticsData = {
    labels: dashboardData.outpassStatistics.map(stat => stat.day),
    datasets: [
      {
        label: 'Number of Outpasses',
        data: dashboardData.outpassStatistics.map(stat => stat.count),
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
      },
    ],
  };

  const outpassStatisticsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Outpass Requests (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Outpasses',
        },
      },
    },
  };

  // Prepare data for current attendance distribution
  const currentAttendanceData = {
    labels: ['In campus but not in Hostel', 'Outing', 'Leave'],
    datasets: [
      {
        data: [
          dashboardData.currentAttendanceDistribution.inCampus,
          dashboardData.currentAttendanceDistribution.outing,
          dashboardData.currentAttendanceDistribution.leave,
        ],
        backgroundColor: [
          'rgba(53, 162, 235, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
      },
    ],
  };

  const currentAttendanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Current Student Location',
      },
    },
  };

  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Hostel Management Dashboard</h1>
      
      {/* Top row - Current stats summary */}
      <div className="flex w-full gap-3 mb-4 flex-wrap">
        <div className="bg-white rounded-lg shadow p-6 w-full border-l-4 border-blue-600">
          <h2 className="text-lg font-semibold mb-4">Total Students</h2>
          <p className="text-4xl font-bold text-blue-600">
            {dashboardData.currentAttendanceDistribution.inCampus + 
             dashboardData.currentAttendanceDistribution.outing + 
             dashboardData.currentAttendanceDistribution.leave}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 w-full border-l-4 border-orange-500">
          <h2 className="text-lg font-semibold mb-4">Students Out</h2>
          <p className="text-4xl font-bold text-orange-500">
            {dashboardData.currentAttendanceDistribution.outing + 
             dashboardData.currentAttendanceDistribution.leave}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 w-full border-l-4 border-green-400">
          <h2 className="text-lg font-semibold mb-4">Leaves Today</h2>
          <p className="text-4xl font-bold text-green-600">
            {dashboardData.currentAttendanceDistribution.leave}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 w-full border-l-4 border-purple-600">
          <h2 className="text-lg font-semibold mb-4">Outings Today</h2>
          <p className="text-4xl font-bold text-purple-600">
            {dashboardData.currentAttendanceDistribution.outing}
          </p>
        </div>
      </div>
      
      {/* Main charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <Line options={attendanceTrendsOptions} data={attendanceTrendsData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Doughnut options={currentAttendanceOptions} data={currentAttendanceData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <Bar options={hostelOccupancyOptions} data={hostelOccupancyData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <Bar options={outpassStatisticsOptions} data={outpassStatisticsData} />
        </div>
      </div>

    </div>
  );
};

export default Visualization;