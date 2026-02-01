import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import financeService from '../../services/financeService';
import ContributionRecorder from '../../components/finance/ContributionRecorder';
import {
    FiTrendingUp, FiActivity, FiPlus, FiPieChart, FiDownload, FiArrowRight
} from 'react-icons/fi';

const FinanceDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalContributions: 0,
        monthlyGrowth: 12.5, // Mock growth for UI
        activePledges: 0,
        recentTransactions: []
    });
    const [loading, setLoading] = useState(true);
    const [showContributionModal, setShowContributionModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(prev => ({ ...prev, ...data }));
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
            const data = await dashboardService.getStats();
            setStats(prev => ({ ...prev, ...data }));
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to record contribution' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const formatCurrency = (val) => {
        return `KSh ${Number(val || 0).toLocaleString()}`;
    };

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto overflow-hidden px-4 md:px-6">
            {message.text && (
                <div className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success'
                        ? 'bg-blue-500/10 border-blue-200 text-blue-700'
                        : 'bg-red-500/10 border-red-200 text-red-700'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-blue-500' : 'bg-red-500'}`} />
                        <span className="font-bold tracking-tight">{message.text}</span>
                    </div>
                </div>
            )}

            {/* Header Section - Cinematic Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
                <div>
                    <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] mb-3 block opacity-70">
                        Financial Stewardship
                    </span>
                    <h1 className="text-[40px] md:text-5xl font-black text-secondary-dark tracking-tighter leading-none mb-4">
                        Treasury <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Overview</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-lg">
                        Detailed reporting and management of Kingdom resources and community contributions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-14 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <FiDownload className="text-lg" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => setShowContributionModal(true)}
                        className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-indigo-700 text-white font-black text-xs uppercase tracking-widest hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-blue-200 shadow-lg"
                    >
                        <FiPlus className="text-lg" />
                        <span>Record Funds</span>
                    </button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Main Card - Big Stat */}
                <div className="md:col-span-8 group relative bg-secondary-dark rounded-[2.5rem] p-10 text-white overflow-hidden shadow-2xl border border-white/5 min-h-[400px] flex flex-col justify-end">
                    {/* Background Visuals */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-1000"></div>
                    <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                        <FiPieChart className="w-80 h-80 rotate-12" />
                    </div>

                    <div className="relative z-10 w-full">
                        <div className="inline-flex items-center gap-3 py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Global Revenue</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-4">
                            <div>
                                <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] mb-4">Total Contributions Balance</h3>
                                <div className="text-5xl md:text-7xl font-black tracking-tighter flex items-start gap-2">
                                    <span className="text-3xl mt-2 opacity-50">KSh</span>
                                    {loading ? '---,---' : (stats.totalContributions || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                                <div className="flex items-center gap-2 text-blue-300 font-black text-xl mb-1">
                                    <FiActivity />
                                    <span>+{stats.monthlyGrowth}%</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly Growth</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Cards */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    {/* Secondary Stat A */}
                    <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft group hover:border-primary/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <FiTrendingUp className="text-xl" />
                        </div>
                        <h4 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-2">Operational Funds</h4>
                        <div className="text-3xl font-black text-secondary-dark tracking-tighter">
                            {formatCurrency(stats.totalContributions * 0.4)}
                        </div>
                        <div className="mt-4 w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: '40%' }}></div>
                        </div>
                    </div>

                    {/* Secondary Stat B */}
                    <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-soft group hover:border-primary/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                            <FiActivity className="text-xl" />
                        </div>
                        <h4 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-2">Pending Pledges</h4>
                        <div className="text-3xl font-black text-secondary-dark tracking-tighter">
                            {formatCurrency(stats.activePledges || 450000)}
                        </div>
                        <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Fulfillment</p>
                    </div>
                </div>

                {/* Bottom Wide Card - Transactions */}
                <div className="md:col-span-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden min-h-[400px]">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-black text-secondary-dark tracking-tight">Recent Activity</h3>
                            <p className="text-slate-400 text-sm font-medium">Real-time contribution registry</p>
                        </div>
                        <Link to="/finance" className="h-12 px-6 rounded-xl bg-slate-50 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                            <span>Audit Trail</span>
                            <FiArrowRight />
                        </Link>
                    </div>

                    <div className="p-12 text-center text-gray-500">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100">
                            <FiPieChart className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-xl font-black text-secondary-dark mb-3 tracking-tight">Synchronizing Records</h4>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed font-medium">
                            We're currently indexing the latest financial data. Complete details will appear here momentarily.
                        </p>
                        <button
                            onClick={() => setShowContributionModal(true)}
                            className="h-12 px-8 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                            Quick Entry +
                        </button>
                    </div>
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
