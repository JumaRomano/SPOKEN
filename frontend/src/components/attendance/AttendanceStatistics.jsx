import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiCalendar, FiFilter, FiActivity } from 'react-icons/fi';
import attendanceService from '../../services/attendanceService';

const AttendanceStatistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async (startDate = null, endDate = null) => {
        setLoading(true);
        setError('');
        try {
            const data = await attendanceService.getStatistics(startDate, endDate);
            setStats(data);
        } catch (err) {
            setError('Failed to load statistics');
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        fetchStatistics(dateRange.startDate || null, dateRange.endDate || null);
    };

    const handleReset = () => {
        setDateRange({ startDate: '', endDate: '' });
        fetchStatistics();
    };

    const StatCard = ({ title, value, subtext, icon: Icon, colorClass, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${colorClass}`}>
                <Icon className="w-24 h-24" />
            </div>

            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase">{title}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold text-gray-900 tracking-tight">{value}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{subtext}</p>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="min-h-[300px] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Growth Insights</h2>
                    <p className="text-gray-500 text-sm mt-1">Overview of church attendance and engagement</p>
                </div>

                <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded-xl">
                    <div className="flex items-center gap-2 px-2">
                        <FiCalendar className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Filter Range</span>
                    </div>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <button
                        onClick={handleFilter}
                        className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Services"
                    value={stats?.total_services || 0}
                    subtext="Worship gatherings conducted"
                    icon={FiCalendar}
                    colorClass="bg-blue-500"
                    delay={0.1}
                />

                <StatCard
                    title="Total Checks-ins"
                    value={stats?.total_attendance_records || 0}
                    subtext="Individual attendance records"
                    icon={FiUsers}
                    colorClass="bg-emerald-500"
                    delay={0.2}
                />

                <StatCard
                    title="Avg. Attendance"
                    value={stats?.avg_attendance_per_service ? Math.round(stats.avg_attendance_per_service) : 0}
                    subtext="People per service"
                    icon={FiActivity}
                    colorClass="bg-purple-500"
                    delay={0.3}
                />
            </div>

            {/* Empty State / Placeholder for Charts */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                <FiTrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-900 font-medium">Detailed Analytics</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                    Advanced charts and trend analysis will appear here as more data is collected over time.
                </p>
            </div>
        </div>
    );
};

export default AttendanceStatistics;
