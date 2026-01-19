import { useState, useEffect } from 'react';
import attendanceService from '../../services/attendanceService';
import Card from '../common/Card';

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

    if (loading) {
        return (
            <Card title="Attendance Statistics">
                <div className="text-center py-8 text-gray-500">Loading statistics...</div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="Attendance Statistics">
                <div className="text-center py-8 text-red-500">{error}</div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card title="Attendance Statistics">
                <div className="space-y-4">
                    {/* Date Range Filter */}
                    <div className="flex gap-4 items-end pb-4 border-b">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) =>
                                    setDateRange(prev => ({ ...prev, startDate: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) =>
                                    setDateRange(prev => ({ ...prev, endDate: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            onClick={handleFilter}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Filter
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-sm font-medium text-blue-600 mb-1">
                                Total Services
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                                {stats?.total_services || 0}
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-sm font-medium text-green-600 mb-1">
                                Total Attendance Records
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                                {stats?.total_attendance_records || 0}
                            </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="text-sm font-medium text-purple-600 mb-1">
                                Average Attendance
                            </div>
                            <div className="text-2xl font-bold text-purple-900">
                                {stats?.avg_attendance_per_service
                                    ? Math.round(stats.avg_attendance_per_service)
                                    : 0}
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-sm text-gray-600">
                        <p>
                            Showing statistics for{' '}
                            {dateRange.startDate && dateRange.endDate
                                ? `${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(
                                    dateRange.endDate
                                ).toLocaleDateString()}`
                                : 'all time'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AttendanceStatistics;
