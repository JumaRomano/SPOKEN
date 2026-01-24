import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import eventService from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { FiMapPin, FiClock, FiCalendar, FiUsers, FiDollarSign, FiInfo, FiCheckCircle, FiHeart } from 'react-icons/fi';

const EventDetailModal = ({ event: initialEvent, isOpen, onClose }) => {
    const { user } = useAuth();
    const [event, setEvent] = useState(initialEvent);
    const [loading, setLoading] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [volunteering, setVolunteering] = useState(null); // roleId being signed up for
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (isOpen && initialEvent?.id) {
            loadEventDetails();
        }
    }, [isOpen, initialEvent]);

    const loadEventDetails = async () => {
        try {
            setLoading(true);
            const data = await eventService.getById(initialEvent.id);
            setEvent(data);
        } catch (err) {
            console.error('Failed to load event details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        try {
            setRegistering(true);
            setMessage({ type: '', text: '' });
            await eventService.register(event.id, {
                memberId: user.member_id || user.id, // Fallback if member_id not in context
                paymentAmount: event.cost || 0
            });
            setMessage({ type: 'success', text: 'Successfully registered for the event!' });
            loadEventDetails();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
        } finally {
            setRegistering(false);
        }
    };

    const handleVolunteer = async (roleId) => {
        try {
            setVolunteering(roleId);
            setMessage({ type: '', text: '' });
            await eventService.volunteerSignup(roleId, {
                memberId: user.member_id || user.id
            });
            setMessage({ type: 'success', text: 'Thank you for volunteering!' });
            loadEventDetails();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Volunteer signup failed' });
        } finally {
            setVolunteering(null);
        }
    };

    if (!isOpen) return null;

    const isUpcoming = event ? new Date(event.start_date) > new Date() : false;
    const isDeadlinePassed = event?.registration_deadline ? new Date(event.registration_deadline) < new Date() : false;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event?.event_name || 'Event Details'} maxWidth="max-w-4xl">
            {loading && !event ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : event && (
                <div className="flex flex-col gap-6">
                    {/* Hero Section */}
                    <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-inner">
                        <img
                            src={event.banner_url || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1400&auto=format&fit=crop"}
                            alt={event.event_name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h2 className="text-3xl font-bold">{event.event_name}</h2>
                            <p className="flex items-center gap-2 text-indigo-200 mt-1">
                                <FiMapPin /> {event.location || 'Spoken Word Ministry'}
                            </p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
                            <span className="font-semibold">{message.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Side: Info */}
                        <div className="md:col-span-2 space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-3">About this event</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {event.description || 'No description provided.'}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-3">Volunteer Opportunities</h3>
                                {event.volunteer_roles && event.volunteer_roles.length > 0 ? (
                                    <div className="grid gap-3">
                                        {event.volunteer_roles.map(role => (
                                            <div key={role.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-indigo-200 transition-all">
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{role.role_name}</h4>
                                                    <p className="text-xs text-gray-500">{role.description}</p>
                                                    <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
                                                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                            {role.slots_filled || 0} / {role.slots_needed} Slots Filled
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="small"
                                                    variant="outline"
                                                    disabled={volunteering === role.id || (role.slots_filled >= role.slots_needed)}
                                                    onClick={() => handleVolunteer(role.id)}
                                                    className="rounded-xl"
                                                >
                                                    {volunteering === role.id ? '...' : (role.slots_filled >= role.slots_needed ? 'Full' : 'Volunteer')}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm">No volunteer roles listed at the moment.</p>
                                )}
                            </section>
                        </div>

                        {/* Right Side: Sidebar Details */}
                        <div className="space-y-6">
                            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FiCalendar className="text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Date</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiClock className="text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Time</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiDollarSign className="text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Cost</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {event.cost > 0 ? `KES ${parseFloat(event.cost).toLocaleString()}` : 'Free'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiUsers className="text-indigo-600 mt-1" />
                                        <div>
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Capacity</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {event.registration_count || 0} / {event.max_participants || '∞'} Attending
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {isUpcoming && event.registration_required && (
                                    <div className="pt-4 mt-4 border-t border-indigo-200">
                                        <Button
                                            variant="primary"
                                            className="w-full py-4 rounded-2xl shadow-lg shadow-indigo-200"
                                            onClick={handleRegister}
                                            disabled={registering || isDeadlinePassed || (event.max_participants && event.registration_count >= event.max_participants)}
                                        >
                                            {registering ? 'Processing...' : (isDeadlinePassed ? 'Deadline Passed' : 'Register Now')}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100">
                                <div className="flex items-center gap-3 text-pink-600 mb-2">
                                    <FiHeart className="fill-pink-600" />
                                    <h4 className="font-bold">Be a Blessing</h4>
                                </div>
                                <p className="text-xs text-pink-800 leading-relaxed">
                                    Help us reach more people! You can also support our ministry through giving.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default EventDetailModal;
