import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import financeService from '../../services/financeService';
import ContributionRecorder from '../../components/finance/ContributionRecorder';
import {
    FiDollarSign, FiTrendingUp, FiActivity, FiPlus, FiPieChart, FiDownload, FiArrowRight
} from 'react-icons/fi';

const FinanceDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalContributions: 0,
        // other stats might be returned but we focus on finance
    });
    const [loading, setLoading] = useState(true);
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

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

    const handleRecordContribution = async (contributionData) => {
        try {
            await financeService.recordContribution(contributionData);
            setMessage({ type: 'success', text: 'Contribution recorded successfully!' });
            // Refresh stats
            const data = await dashboardService.getStats();
            setStats(data);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to record contribution' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {message.text && (
                <div
                    className={`px-4 py-3 rounded ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Finance Overview</h1>
                    <p className="text-gray-500 mt-1">Financial health and contribution tracking</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <FiDownload />
                        Download Report
                    </button>
                    <button
                        onClick={() => setShowContributionModal(true)}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                        <FiPlus />
                        Record Contribution
                    </button>
                </div>
            </div>

            {/* Finance Primary Stat */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 opacity-90">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FiDollarSign className="w-6 h-6" />
                            </div>
                            <span className="font-medium">Total Contributions</span>
                        </div>
                        <div className="text-4xl font-bold mb-4">
                            KES {loading ? '...' : (stats.totalContributions || 0).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-green-100 text-sm">
                            <FiTrendingUp />
                            <span>Total contributions to date</span>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FiDollarSign className="w-64 h-64 transform translate-x-16 -translate-y-16" />
                    </div>
                </div>
            </div>

            {/* Recent Transactions Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900">Recent Transactions</h3>
                    <Link to="/finance" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        View All <FiArrowRight />
                    </Link>
                </div>
                <div className="p-12 text-center text-gray-500">
                    <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FiDollarSign className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="font-medium text-lg text-gray-900 mb-1">No transactions yet</p>
                    <p className="text-sm mb-6">Start tracking contributions to see financial insights here.</p>
                    <button
                        onClick={() => setShowContributionModal(true)}
                        className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                    >
                        <FiPlus />
                        Record First Contribution
                    </button>
                </div>
            </div>

            <ContributionRecorder
                isOpen={showContributionModal}
                onClose={() => setShowContributionModal(false)}
                onContributionRecorded={handleRecordContribution}
            />
        </div>
    );
};

export default FinanceDashboard;
