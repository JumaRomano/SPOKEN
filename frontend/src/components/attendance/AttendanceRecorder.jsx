import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCheck, FiX, FiUser, FiMoreHorizontal, FiCheckCircle } from 'react-icons/fi';
import attendanceService from '../../services/attendanceService';
import memberService from '../../services/memberService';
import Button from '../common/Button';

const AttendanceRecorder = ({ onAttendanceRecorded }) => {
    const [services, setServices] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, selected, unselected

    useEffect(() => {
        fetchServices();
        fetchMembers();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await attendanceService.getServices({ limit: 50 });
            setServices(data);
            // Auto-select most recent service if available
            if (data.length > 0) {
                setSelectedService(data[0].id);
            }
        } catch (err) {
            console.error('Error fetching services:', err);
        }
    };

    const fetchMembers = async () => {
        try {
            const data = await memberService.getAll({ limit: 1000 }); // Increase limit for robustness
            setMembers(data.members || data);
        } catch (err) {
            console.error('Error fetching members:', err);
        }
    };

    const toggleMemberSelection = (memberId) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSelectAll = (filteredData) => {
        const allIds = filteredData.map(m => m.id);
        const allSelected = allIds.every(id => selectedMembers.includes(id));

        if (allSelected) {
            // Deselect all visible
            setSelectedMembers(prev => prev.filter(id => !allIds.includes(id)));
        } else {
            // Select all visible
            const newSelected = [...new Set([...selectedMembers, ...allIds])];
            setSelectedMembers(newSelected);
        }
    };

    const handleSubmit = async () => {
        if (!selectedService) {
            setMessage({ type: 'error', text: 'Please select a service' });
            return;
        }

        if (selectedMembers.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one member' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await attendanceService.bulkRecordAttendance(selectedService, selectedMembers);
            setMessage({
                type: 'success',
                text: `Successfully recorded attendance for ${selectedMembers.length} members!`
            });
            setSelectedMembers([]);
            if (onAttendanceRecorded) onAttendanceRecorded();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to record attendance'
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter members
    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.last_name.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filterStatus === 'selected') return selectedMembers.includes(member.id);
        if (filterStatus === 'unselected') return !selectedMembers.includes(member.id);
        return true;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Record Attendance</h2>

            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                    <div className="relative">
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
                        >
                            <option value="">Choose a service...</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>
                                    {new Date(s.service_date).toLocaleDateString()} - {s.service_type.replace('_', ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Members</label>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find member..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Selection Toolbar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2 text-sm">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1 rounded-full transition-colors ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All ({members.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('selected')}
                        className={`px-3 py-1 rounded-full transition-colors ${filterStatus === 'selected' ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                    >
                        Selected ({selectedMembers.length})
                    </button>
                </div>

                <button
                    onClick={() => handleSelectAll(filteredMembers)}
                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                    {filteredMembers.every(m => selectedMembers.includes(m.id)) && filteredMembers.length > 0 ? 'Deselect Visible' : 'Select Visible'}
                </button>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto p-1">
                <AnimatePresence>
                    {filteredMembers.map(member => {
                        const isSelected = selectedMembers.includes(member.id);
                        return (
                            <motion.div
                                key={member.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => toggleMemberSelection(member.id)}
                                className={`
                                    relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                                    ${isSelected
                                        ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary'
                                        : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                                        ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
                                    `}>
                                        {member.first_name[0]}{member.last_name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                            {member.first_name} {member.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">Member</p>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-primary"
                                        >
                                            <FiCheckCircle className="w-5 h-5 fill-current" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredMembers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No members found matching your search.
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                    <span className="font-bold text-gray-900">{selectedMembers.length}</span> members ready to mark present
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setSelectedMembers([])}
                        disabled={selectedMembers.length === 0}
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || selectedMembers.length === 0 || !selectedService}
                        className="bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20"
                    >
                        {loading ? 'Saving...' : 'Confirm Attendance'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRecorder;
