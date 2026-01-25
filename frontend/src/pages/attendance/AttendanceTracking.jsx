import { useState, useEffect } from 'react';
import attendanceService from '../../services/attendanceService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CreateServiceModal from '../../components/attendance/CreateServiceModal';
import AttendanceRecorder from '../../components/attendance/AttendanceRecorder';
import AttendanceStatistics from '../../components/attendance/AttendanceStatistics';
import './AttendanceTracking.css';

const AttendanceTracking = () => {
    const [activeTab, setActiveTab] = useState('services');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchServices();
    }, [activeTab]); // Refetch whenever tab changes

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await attendanceService.getServices({ limit: 50 });
            setServices(data);
        } catch (err) {
            console.error('Error fetching services:', err);
            setMessage({ type: 'error', text: 'Failed to load services' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateService = async (serviceData) => {
        await attendanceService.createService(serviceData);
        setMessage({ type: 'success', text: 'Service created successfully!' });
        fetchServices();
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            await attendanceService.deleteService(id);
            setMessage({ type: 'success', text: 'Service deleted successfully!' });
            fetchServices();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to delete service'
            });
        }
    };

    const TabButton = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="attendance-container p-6">
            {message.text && (
                <div
                    className={`mb-4 px-4 py-3 rounded ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Attendance Tracking</h1>
                {activeTab === 'services' && (
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        Create Service
                    </Button>
                )}
            </div>

            <div className="flex space-x-1 border-b border-gray-200 mb-6">
                <TabButton tab="services" label="Services" />
                <TabButton tab="record" label="Record Attendance" />
                <TabButton tab="statistics" label="Statistics" />
            </div>

            {activeTab === 'services' && (
                <Card>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading services...</div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No Services Yet</h3>
                            <p className="text-gray-500 mb-4">
                                Create your first service to start tracking attendance
                            </p>
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                Create Service
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Attendance
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {services.map((service) => (
                                        <tr key={service.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(service.service_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {service.service_type?.replace('_', ' ').toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {service.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {service.total_attendance || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'record' && <AttendanceRecorder onAttendanceRecorded={fetchServices} />}

            {activeTab === 'statistics' && <AttendanceStatistics />}

            <CreateServiceModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onServiceCreated={handleCreateService}
            />
        </div>
    );
};

export default AttendanceTracking;

