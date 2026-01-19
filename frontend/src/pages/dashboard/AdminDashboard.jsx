import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import {
    FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiActivity,
    FiPlus, FiCheckCircle, FiServer, FiDatabase, FiShield, FiArrowRight
} from 'react-icons/fi';
import { BiGroup } from 'react-icons/bi';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalGroups: 0,
        upcomingEvents: 0,
        totalContributions: 0,
        myGroups: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
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
            icon: <FiUsers className="w-6 h-6" />,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            link: '/members',
            trend: 'View all members'
        },
        {
            label: 'Active Groups',
            value: stats.totalGroups || stats.myGroups,
            icon: <BiGroup className="w-6 h-6" />,
            color: 'text-green-600',
            bg: 'bg-green-50',
            link: '/groups',
            trend: 'Manage groups'
        },
        {
            label: 'Upcoming Events',
            value: stats.upcomingEvents,
            icon: <FiCalendar className="w-6 h-6" />,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            link: '/events',
            trend: 'View calendar'
        },
        {
            label: 'Total Contributions',
            value: stats.totalContributions ? `KES ${stats.totalContributions.toLocaleString()}` : 'KES 0',
            icon: <FiDollarSign className="w-6 h-6" />,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            link: '/finance',
            trend: 'Updated just now'
        },
    ];

    const quickActions = [
        { to: '/members', label: 'Add Member', icon: <FiPlus />, color: 'bg-blue-600 hover:bg-blue-700' },
        { to: '/finance', label: 'Record Contribution', icon: <FiDollarSign />, color: 'bg-green-600 hover:bg-green-700' },
        { to: '/events', label: 'Create Event', icon: <FiCalendar />, color: 'bg-orange-600 hover:bg-orange-700' },
        { to: '/attendance', label: 'Mark Attendance', icon: <FiCheckCircle />, color: 'bg-purple-600 hover:bg-purple-700' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
                    <p className="text-gray-500 mt-1">System status and key metrics for {user?.email}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <FiCalendar />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statItems.map((stat, index) => (
                    <Link
                        to={stat.link}
                        key={index}
                        className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            {index === 0 && <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full"><FiTrendingUp className="mr-1" /> Trending</span>}
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {loading ? <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div> : stat.value}
                            </div>
                            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 group-hover:text-primary transition-colors">
                                <span>{stat.trend}</span>
                                <FiArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Actions Grid */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FiActivity className="text-primary" />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {quickActions.map((action, idx) => (
                                <Link
                                    key={idx}
                                    to={action.to}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all text-center gap-3 group"
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${action.color}`}>
                                        <span className="text-xl">{action.icon}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{action.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <FiActivity className="text-2xl text-gray-300" />
                            </div>
                            <p>No recent activity using the system.</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">System Status</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full text-green-600"><FiServer /></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">API Server</div>
                                        <div className="text-xs text-green-700">Operational</div>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full text-blue-600"><FiDatabase /></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Database</div>
                                        <div className="text-xs text-blue-700">Connected</div>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-full text-purple-600"><FiShield /></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Auth System</div>
                                        <div className="text-xs text-purple-700">Secure</div>
                                    </div>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
