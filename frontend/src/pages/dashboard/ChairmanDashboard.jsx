import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import {
    FiBarChart2, FiTrendingUp, FiPieChart, FiActivity, FiUsers, FiDollarSign, FiArrowRight, FiFileText
} from 'react-icons/fi';

const ChairmanDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalContributions: 0,

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
                    <h1 className="text-3xl font-bold text-gray-900">Chairman Overview</h1>
                    <p className="text-gray-500 mt-1">Strategic Oversight & Church Health</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <FiFileText />
                        Audit Reports
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
                        <FiBarChart2 />
                        Strategy Review
                    </button>
                </div>
            </div>

            {/* High Level KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Membership KPI */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-gray-500 text-sm font-medium mb-1">Total Membership</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalMembers}</div>
                        <div className="text-xs text-gray-400 mt-2">
                            View membership trends
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-gray-50 opacity-50">
                        <FiUsers className="w-24 h-24" />
                    </div>
                </div>

                {/* Fiscal Health - removed fake data */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-gray-500 text-sm font-medium mb-1">Total Contributions</div>
                        <div className="text-3xl font-bold text-gray-900">KES {stats.totalContributions?.toLocaleString() || '0'}</div>
                        <div className="text-xs text-gray-400 mt-2">
                            View financial reports
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-green-50 opacity-50">
                        <FiDollarSign className="w-24 h-24" />
                    </div>
                </div>

                {/* Removed fake engagement metric */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-gray-500 text-sm font-medium mb-1">Total Groups</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.totalGroups || 0}</div>
                        <div className="text-xs text-purple-600 mt-2">
                            Active ministries
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-purple-50 opacity-50">
                        <FiActivity className="w-24 h-24" />
                    </div>
                </div>


            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Actionable Insights */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-6">Strategic Priorities</h3>
                        <div className="space-y-4">
                            <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                                        <FiActivity className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Annual Budget Approval</h4>
                                        <p className="text-sm text-gray-500">Finance dept submitted review</p>
                                    </div>
                                </div>
                                <button className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800">Review</button>
                            </div>

                            <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <FiUsers className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Leadership Training</h4>
                                        <p className="text-sm text-gray-500">12 Candidates proposed</p>
                                    </div>
                                </div>
                                <button className="text-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">View List</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="font-bold text-xl mb-2">Quarterly Board Meeting</h3>
                                <p className="text-gray-300">Scheduled for next Friday at 2:00 PM.</p>
                            </div>
                            <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                                View Agenda
                            </button>
                        </div>
                        {/* Circle decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Ministry Overview</h3>
                        <div className="text-center py-8 text-gray-400">
                            <p className="text-sm">Department metrics coming soon</p>
                        </div>
                        <Link to="/groups" className="block mt-6 text-center text-primary text-sm font-medium hover:underline">View All Departments</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChairmanDashboard;
