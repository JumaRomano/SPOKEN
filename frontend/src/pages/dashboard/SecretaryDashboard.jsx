import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import {
    FiUsers, FiCalendar, FiFileText, FiMessageSquare, FiClipboard, FiUserPlus, FiArrowRight
} from 'react-icons/fi';

const SecretaryDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalMembers: 0,

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
    }, [user]);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Secretary Dashboard</h1>
                    <p className="text-gray-500 mt-1">Administration, Records, and Communications</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/minutes" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <FiFileText />
                        Minutes
                    </Link>
                    <Link to="/members/create" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        <FiUserPlus />
                        Add Member
                    </Link>
                </div>
            </div>

            {/* Core Administrative Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FiUsers className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Membership</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalMembers}</h3>
                        </div>
                    </div>
                    <div className="text-xs text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-1 rounded">
                        Latest: Member Directory Up to Date
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <FiClipboard className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Attendance Records</p>
                            <h3 className="text-3xl font-bold text-gray-900">Active</h3>
                        </div>
                    </div>
                    <Link to="/attendance" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                        Manage Attendance <FiArrowRight />
                    </Link>
                </div>


            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Communications Center - Placeholder or Remove? User asked to remove 'communication feature'. Keeping placeholder just in case, but removing link */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                        <FiMessageSquare className="text-purple-600" />
                        Quick Notes
                    </h3>
                    <div className="text-center py-12 text-gray-400">
                        <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                            <FiFileText className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm">Use "Minutes" to record notes.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/members" className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg hover:bg-blue-700 transition-colors flex flex-col justify-between group">
                        <FiUsers className="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="font-bold text-lg">Member Registry</h3>
                            <p className="text-blue-100 text-sm">Manage database</p>
                        </div>
                    </Link>
                    <Link to="/attendance" className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:bg-indigo-700 transition-colors flex flex-col justify-between group">
                        <FiClipboard className="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="font-bold text-lg">Take Attendance</h3>
                            <p className="text-indigo-100 text-sm">Service & Groups</p>
                        </div>
                    </Link>

                    <Link to="/minutes" className="bg-green-600 text-white p-6 rounded-2xl shadow-lg hover:bg-green-700 transition-colors flex flex-col justify-between group">
                        <FiFileText className="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
                        <div>
                            <h3 className="font-bold text-lg">Meeting Minutes</h3>
                            <p className="text-green-100 text-sm">Record keeping</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SecretaryDashboard;
