import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiCalendar, FiUsers, FiActivity, FiSearch, FiFilter } from 'react-icons/fi';
import attendanceService from '../../services/attendanceService';
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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'services') fetchServices();
    }, [activeTab]);

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
        try {
            await attendanceService.createService(serviceData);
            setMessage({ type: 'success', text: 'Service created successfully!' });
            await fetchServices(); // Ensure this is awaited
            setShowCreateModal(false);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to create service' });
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            await attendanceService.deleteService(id);
            setMessage({ type: 'success', text: 'Service deleted successfully!' });
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to delete service'
            });
        }
    };

    // Filter services based on search
    const filteredServices = services.filter(service =>
        (service.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.service_type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'services', label: 'Services', icon: FiCalendar },
        { id: 'record', label: 'Record Attendance', icon: FiUsers },
        { id: 'statistics', label: 'Insights', icon: FiActivity },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Management</h1>
                        <p className="text-gray-500 mt-1">Track worship services, record member attendance, and analyze growth.</p>
                    </div>

                    {activeTab === 'services' && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 font-medium transition-all"
                        >
                            <FiPlus className="w-5 h-5" />
                            New Service
                        </motion.button>
                    )}
                </div>

                {/* Notifications */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-red-50 border-red-100 text-red-700'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {message.text}
                            <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto hover:opacity-70">✕</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Navigation */}
                <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-gray-100 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/5 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative flex items-center gap-2">
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'services' && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                                {/* Toolbar */}
                                <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                                    <div className="relative flex-1 max-w-md">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search services..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        />
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                        <FiFilter className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                                <th className="px-6 py-4">Date & Time</th>
                                                <th className="px-6 py-4">Event Type</th>
                                                <th className="px-6 py-4">Description</th>
                                                <th className="px-6 py-4 text-center">Attendance</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                                                        Loading records...
                                                    </td>
                                                </tr>
                                            ) : filteredServices.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-16 text-center">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                            <FiCalendar className="w-8 h-8" />
                                                        </div>
                                                        <h3 className="text-gray-900 font-medium mb-1">No services found</h3>
                                                        <p className="text-gray-500 text-sm mb-6">Create a new service to get started.</p>
                                                        <button
                                                            onClick={() => setShowCreateModal(true)}
                                                            className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                                                        >
                                                            <FiPlus />
                                                            Create Service
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredServices.map((service) => (
                                                    <tr key={service.id} className="group hover:bg-gray-50/80 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-900">
                                                                    {new Date(service.service_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(`2000-01-01T${service.service_time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                                                                {service.service_type?.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-gray-600 truncate max-w-xs">{service.description || '-'}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-lg font-semibold text-gray-700">{service.total_attendance || 0}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleDeleteService(service.id)}
                                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                                title="Delete Service"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'record' && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                                <AttendanceRecorder onAttendanceRecorded={fetchServices} />
                            </div>
                        )}

                        {activeTab === 'statistics' && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                                <AttendanceStatistics />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <CreateServiceModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onServiceCreated={handleCreateService}
                />
            </div>
        </div>
    );
};

export default AttendanceTracking;
