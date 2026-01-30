import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFileText, FiCalendar, FiClock, FiTrash2, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import minutesService from '../../services/minutesService';
import Button from '../../components/common/Button';

const MinutesManager = () => {
    const [minutes, setMinutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMinute, setEditingMinute] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        meetingDate: new Date().toISOString().split('T')[0],
        content: '',
        groupId: ''
    });

    useEffect(() => {
        fetchMinutes();
    }, []);

    const fetchMinutes = async () => {
        try {
            setLoading(true);
            const data = await minutesService.getAll({ search: searchTerm });
            setMinutes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };

            // Ensure date is properly formatted
            if (!payload.meetingDate) {
                payload.meetingDate = new Date().toISOString().split('T')[0];
            } else {
                // Should already be YYYY-MM-DD from input type="date", but safe check
                payload.meetingDate = new Date(payload.meetingDate).toISOString().split('T')[0];
            }

            if (editingMinute) {
                await minutesService.update(editingMinute.id, payload);
            } else {
                await minutesService.create(payload);
            }
            fetchMinutes();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save minute', err);
            alert('Failed to save. ' + (err.response?.data?.error || 'Please try again.'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await minutesService.delete(id);
                fetchMinutes();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (minute) => {
        setEditingMinute(minute);
        setFormData({
            title: minute.title,
            meetingDate: minute.meeting_date.split('T')[0],
            content: minute.content,
            groupId: minute.group_id || ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMinute(null);
        setFormData({ title: '', meetingDate: new Date().toISOString().split('T')[0], content: '', groupId: '' });
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meeting Minutes</h1>
                    <p className="text-gray-500">Record and manage official meeting notes</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <FiPlus /> New Entry
                </Button>
            </div>

            {/* Search */}
            <div className="mb-6 relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search minutes..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchMinutes()}
                />
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : minutes.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                        <FiFileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No minutes recorded yet.</p>
                    </div>
                ) : (
                    minutes.map((minute) => (
                        <motion.div
                            key={minute.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{minute.title}</h3>
                                    {minute.group_name && (
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                            {minute.group_name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(minute.meeting_date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><FiClock /> {new Date(minute.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-gray-600 line-clamp-2">{minute.content}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEdit(minute)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <FiEdit2 />
                                </button>
                                <button onClick={() => handleDelete(minute.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h2 className="text-xl font-bold text-gray-800">{editingMinute ? 'Edit Minutes' : 'New Meeting Minute'}</h2>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title / Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Monthly Board Meeting"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.meetingDate}
                                            onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                                        />
                                    </div>
                                    {/* Optional Group Selector could go here */}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-64"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Record meeting notes here..."
                                    />
                                </div>
                            </form>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                                <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                                <Button onClick={handleSubmit} variant="primary" className="flex items-center gap-2">
                                    <FiSave /> Save Record
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MinutesManager;
