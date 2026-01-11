import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import dashboardService from '../../services/dashboardService';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalGroups: 0,
        upcomingEvents: 0,
        totalContributions: 0,
        myGroups: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statItems = [
        {
            label: 'Total Members',
            value: stats.totalMembers,
            icon: '👥',
            color: 'bg-primary-light',
            link: '/members'
        },
        {
            label: 'Active Groups',
            value: stats.totalGroups || stats.myGroups, // Show total for admin, my groups for leaders
            icon: '👪',
            color: 'bg-success',
            link: '/groups'
        },
        {
            label: 'Upcoming Events',
            value: stats.upcomingEvents,
            icon: '📅',
            color: 'bg-orange-400',
            link: '/events'
        },
        {
            label: 'Total Contributions',
            value: stats.totalContributions ? `KES ${stats.totalContributions.toLocaleString()}` : 'KES 0',
            icon: '💰',
            color: 'bg-purple-500',
            link: '/finance'
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-secondary-dark">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {user?.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statItems.map((stat, index) => (
                    <Link
                        to={stat.link}
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform duration-200 border-l-4 border-transparent flex items-center gap-4 block"
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${stat.color} bg-opacity-10 text-opacity-100`}>
                            <span className="grayscale-0">{stat.icon}</span>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">{stat.label}</div>
                            <div className="text-2xl font-bold text-secondary-dark">
                                {loading ? '...' : stat.value}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Recent Activity" subtitle="Latest updates" className="h-full">
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <span className="text-4xl mb-3">📭</span>
                            <p>No recent activity</p>
                        </div>
                    </Card>
                </div>

                {/* Sidebar / Quick Actions Area */}
                <div className="space-y-6">
                    <Card title="Quick Actions">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            <Link to="/members" className="flex items-center gap-3 w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-secondary text-left group">
                                <span className="text-xl group-hover:scale-110 transition-transform">➕</span>
                                Add Member
                            </Link>
                            <Link to="/finance" className="flex items-center gap-3 w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-secondary text-left group">
                                <span className="text-xl group-hover:scale-110 transition-transform">💰</span>
                                Record Contribution
                            </Link>
                            <Link to="/events" className="flex items-center gap-3 w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-secondary text-left group">
                                <span className="text-xl group-hover:scale-110 transition-transform">📅</span>
                                Create Event
                            </Link>
                            <Link to="/attendance" className="flex items-center gap-3 w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all font-medium text-secondary text-left group">
                                <span className="text-xl group-hover:scale-110 transition-transform">✅</span>
                                Mark Attendance
                            </Link>
                        </div>
                    </Card>

                    <Card title="System Information">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-gray-600 pb-3 border-b border-gray-100">
                                <span>✅</span> Backend API: <span className="font-semibold text-success">Connected</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600 pb-3 border-b border-gray-100">
                                <span>✅</span> Database: <span className="font-semibold text-secondary">PostgreSQL</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600 pb-3 border-b border-gray-100">
                                <span>✅</span> Authentication: <span className="font-semibold text-secondary">JWT Active</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <span>✅</span> Your Role: <span className="font-semibold text-primary uppercase tracking-wider text-xs bg-primary-light/10 px-2 py-1 rounded">{user?.role}</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
