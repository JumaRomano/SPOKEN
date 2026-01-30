import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPieChart, FiUsers, FiClipboard, FiCheckSquare, FiSearch, FiCheckCircle } from 'react-icons/fi';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';

// Sub-components for cleaner code
const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            {subtext && <p className="text-slate-400 text-xs mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="text-xl text-white" />
        </div>
    </div>
);

const CheckInRow = ({ reg, onCheckIn }) => {
    const isCheckedIn = reg.attendance_status === 'attended';
    // Get initials from member_name or email
    const getInitials = () => {
        if (reg.member_name) {
            const parts = reg.member_name.trim().split(' ');
            if (parts.length >= 2) {
                return parts[0][0] + parts[parts.length - 1][0];
            }
            return parts[0][0] + (parts[0][1] || '');
        }
        return reg.email ? reg.email.substring(0, 2).toUpperCase() : '??';
    };

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border mb-3 transition-all ${isCheckedIn ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCheckedIn ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {getInitials()}
                </div>
                <div>
                    <h4 className={`font-bold ${isCheckedIn ? 'text-green-800' : 'text-slate-700'}`}>{reg.member_name || 'Unknown'}</h4>
                    <span className="text-xs text-slate-400">{reg.email || 'No email'}</span>
                </div>
            </div>
            <button
                onClick={() => onCheckIn(reg.member_id, isCheckedIn ? 'registered' : 'attended')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isCheckedIn ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                {isCheckedIn ? <><FiCheckCircle /> Checked In</> : 'Check In'}
            </button>
        </div>
    );
};

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [event, setEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State for Check-in
    const [checkInSearch, setCheckInSearch] = useState('');

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [evt, stati, regs, vols] = await Promise.all([
                eventService.getById(id),
                eventService.getStats(id).catch(e => ({})),
                eventService.getRegistrations(id).catch(e => []),
                eventService.getVolunteerSignups(id).catch(e => [])
            ]);

            setEvent(evt);
            setStats(stati);
            setRegistrations(regs);
            setVolunteers(vols);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCheckInToggle = async (memberId, newStatus) => {
        try {
            await eventService.checkIn(id, { memberId, status: newStatus });
            // Optimistic update
            setRegistrations(prev => prev.map(r =>
                r.member_id === memberId ? { ...r, attendance_status: newStatus } : r
            ));
            // Update stats subtly without full reload if possible, or just accept drift
            setStats(prev => ({
                ...prev,
                checked_in: newStatus === 'attended' ? parseInt(prev.checked_in) + 1 : parseInt(prev.checked_in) - 1
            }));
        } catch (err) {
            console.error('Check-in failed', err);
            alert('Check-in failed. Please try again.');
        }
    };

    const filteredRegistrations = registrations.filter(r =>
        r.member_name.toLowerCase().includes(checkInSearch.toLowerCase()) ||
        r.email.toLowerCase().includes(checkInSearch.toLowerCase())
    );

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin text-3xl text-indigo-600">●</div></div>;
    if (!event) return <div className="p-8 text-center text-red-500">Event not found</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/events-management')} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${event.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {event.is_public ? 'Public Event' : 'Internal'}
                            </span>
                            <span className="text-slate-400 text-xs font-mono uppercase">{event.event_type}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800">{event.event_name}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Add Edit/Actions here later */}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-8 max-w-fit">
                {[
                    { id: 'dashboard', icon: FiPieChart, label: 'Dashboard' },
                    { id: 'checkin', icon: FiCheckSquare, label: 'Check-in Desk' },
                    { id: 'registrations', icon: FiUsers, label: 'Registrations' },
                    { id: 'volunteers', icon: FiClipboard, label: 'Volunteers' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Total Registrations"
                                    value={stats.total_registrations || 0}
                                    icon={FiUsers} color="bg-blue-500"
                                    subtext={`${event.max_participants ? Math.round((stats.total_registrations / event.max_participants) * 100) : 0}% Capacity`}
                                />
                                <StatCard
                                    title="Checked In"
                                    value={stats.checked_in || 0}
                                    icon={FiCheckCircle} color="bg-green-500"
                                    subtext={`${stats.total_registrations > 0 ? Math.round((stats.checked_in / stats.total_registrations) * 100) : 0}% Attendance Rate`}
                                />
                                <StatCard
                                    title="Volunteers"
                                    value={stats.total_volunteers || 0}
                                    icon={FiClipboard} color="bg-purple-500"
                                />
                                <StatCard
                                    title="Total Revenue"
                                    value={`$${stats.total_revenue || 0}`}
                                    icon={FiPieChart} color="bg-amber-500"
                                />
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                                <p className="text-slate-400 font-medium">Analytics Chart Placeholder</p>
                                <p className="text-sm text-slate-300">Registration trend over time would go here.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'checkin' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-w-4xl mx-auto">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Check-in Functionality</h2>
                                    <p className="text-sm text-slate-500">Search for attendees and mark them as present.</p>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none"
                                        value={checkInSearch}
                                        onChange={(e) => setCheckInSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="p-6 max-h-[600px] overflow-y-auto">
                                {filteredRegistrations.length > 0 ? (
                                    filteredRegistrations.map(reg => (
                                        <CheckInRow key={reg.id} reg={reg} onCheckIn={handleCheckInToggle} />
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-400">
                                        No matching registrations found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'volunteers' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {volunteers.map(vol => {
                                // Get initials from member_name
                                const getInitials = () => {
                                    if (vol.member_name) {
                                        const parts = vol.member_name.trim().split(' ');
                                        if (parts.length >= 2) {
                                            return parts[0][0] + parts[parts.length - 1][0];
                                        }
                                        return parts[0][0] + (parts[0][1] || '');
                                    }
                                    return vol.email ? vol.email.substring(0, 2).toUpperCase() : '??';
                                };

                                return (
                                    <div key={vol.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                                            {getInitials()}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                                                {vol.role_name || 'Volunteer'}
                                            </span>
                                            <h3 className="font-bold text-slate-800 text-lg">{vol.member_name || 'Unknown'}</h3>
                                            <p className="text-slate-500 text-sm">{vol.email || 'No email'}</p>
                                            {vol.phone && <p className="text-slate-500 text-sm">{vol.phone}</p>}
                                            {vol.notes && (
                                                <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 italic">
                                                    "{vol.notes}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {volunteers.length === 0 && (
                                <div className="col-span-full text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <FiUsers className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                    <p className="font-medium">No volunteers have signed up yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'registrations' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            {registrations.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 border-b">Member</th>
                                            <th className="p-4 border-b">Date</th>
                                            <th className="p-4 border-b">Status</th>
                                            <th className="p-4 border-b text-right">Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {registrations.map(reg => (
                                            <tr key={reg.id} className="hover:bg-slate-50/50">
                                                <td className="p-4 font-medium text-slate-700">{reg.member_name || 'Unknown'}</td>
                                                <td className="p-4 text-slate-500 text-sm">
                                                    {reg.registration_date ? new Date(reg.registration_date).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${reg.attendance_status === 'attended'
                                                            ? 'bg-green-100 text-green-700'
                                                            : reg.attendance_status === 'registered'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {reg.attendance_status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-semibold text-slate-700">
                                                    KES {(reg.amount_paid || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-20 text-slate-400">
                                    <FiUsers className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                    <p className="font-medium">No registrations yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default EventDetail;
