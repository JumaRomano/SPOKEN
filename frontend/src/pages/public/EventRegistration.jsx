import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiCheck, FiAlertCircle, FiArrowRight, FiUser, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';

// Simplified Ticket Logic - Only show if fully confirmed/paid (conceptually), but for now replace "Ticket" with "Registration Receipt"
const RegistrationReceipt = ({ event, user }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 max-w-sm mx-auto relative">
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Registration Pending</p>
                <h2 className="text-xl font-bold leading-tight">{event.event_name}</h2>
            </div>
        </div>

        <div className="p-6">
            <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400"><FiCalendar /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Date</p>
                        <p className="text-sm font-semibold text-slate-800">{new Date(event.start_date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400"><FiClock /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Time</p>
                        <p className="text-sm font-semibold text-slate-800">{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400"><FiMapPin /></div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Location</p>
                        <p className="text-sm font-semibold text-slate-800">{event.location}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500 text-center mb-2">Registration ID</p>
                <p className="text-sm font-mono text-center bg-slate-50 p-2 rounded border border-slate-200">{user?.id?.slice(0, 8).toUpperCase() || 'GUEST'}</p>
            </div>
        </div>

        {(event.cost > 0) && (
            <div className="bg-amber-50 p-4 border-t border-amber-100 text-center">
                <p className="text-amber-800 text-xs font-bold uppercase mb-1">Payment Required</p>
                <p className="text-amber-900 font-bold">KES {event.cost.toLocaleString()}</p>
            </div>
        )}
    </div>
);

const EventRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth(); // Removed unused 'location'

    const [step, setStep] = useState(1); // 1: Info, 2: Volunteer, 3: Success
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Volunteer State
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                const [eventData, rolesData] = await Promise.all([
                    eventService.getById(id),
                    eventService.getVolunteerRoles(id).catch(err => [])
                ]);
                setEvent(eventData);
                setRoles(rolesData || []);
            } catch (err) {
                console.error('Failed to fetch event', err);
                setError('Event unavailable.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    const handleNext = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/events/${id}/register` } });
            return;
        }
        setStep(step + 1);
    };

    const handleConfirm = async () => {
        setSubmitting(true);
        setError(null);
        try {
            // 1. Register for event (ignoring if already registered)
            try {
                await eventService.register(id, { memberId: user.memberId || user.id });
            } catch (regErr) {
                if (regErr.response?.status === 409) {
                    // Already registered - this is fine, continue to volunteer signup
                    console.log('User already registered for event, proceeding to volunteer signup if applicable.');
                } else {
                    throw regErr; // Throw other errors
                }
            }

            // 2. Register for volunteer role if selected
            if (selectedRole) {
                await eventService.volunteerSignup(selectedRole, { memberId: user.memberId || user.id });
            }

            setStep(3); // Success!
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin text-4xl text-slate-800">●</div></div>;
    if (!event) return <div className="min-h-screen flex items-center justify-center text-red-500">Event not found.</div>;

    return (
        <div className="min-h-screen bg-white py-12 px-4 flex justify-center items-start font-sans text-slate-800">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left Side: Dynamic Content based on Step */}
                <div className="order-2 lg:order-1">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="bg-white"
                            >
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Step 1 of 3</span>
                                <h1 className="text-3xl font-bold text-slate-900 mb-6">Confirm Details</h1>

                                <div className="prose prose-slate mb-8 text-slate-600 leading-relaxed">
                                    <p>{event.description || "Join us for this special gathering."}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600">
                                            <FiUser />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Attendee</p>
                                            <p className="font-semibold text-slate-900">{isAuthenticated ? (user.name || user.email) : 'Guest'}</p>
                                        </div>
                                    </div>
                                    {event.cost > 0 && (
                                        <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600">
                                                <span className="font-bold text-xs">KES</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Cost</p>
                                                <p className="font-semibold text-slate-900">KES {event.cost.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button onClick={handleNext} variant="primary" className="w-full justify-center py-3 text-base">
                                    {isAuthenticated ? 'Continue' : 'Login to Continue'} <FiArrowRight className="ml-2" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                            >
                                <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-2 text-sm font-bold"><FiArrowLeft /> Back</button>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Step 2 of 3</span>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">Volunteer Opportunity</h1>
                                <p className="text-slate-500 mb-6">Would you like to serve at this event?</p>

                                {/* Just Attending Option - Compact */}
                                <div className="mb-6 pb-6 border-b border-slate-200">
                                    <button
                                        onClick={() => setSelectedRole(null)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedRole === null ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === null ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                                    {selectedRole === null && <FiCheck className="text-white text-xs" />}
                                                </div>
                                                <span className="font-semibold text-sm">Just Attending</span>
                                            </div>
                                            <span className="text-xs text-slate-400">No volunteer role</span>
                                        </div>
                                    </button>
                                </div>

                                {/* Volunteer Roles Section */}
                                {roles.length > 0 && (
                                    <>
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Available Volunteer Roles</h3>
                                        <div className="space-y-3 mb-8">
                                            {roles.map(role => (
                                                <div
                                                    key={role.id}
                                                    onClick={() => role.slots_filled < role.slots_needed && setSelectedRole(role.id)}
                                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRole === role.id
                                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                                                            : (role.slots_filled >= role.slots_needed
                                                                ? 'opacity-40 border-slate-100 cursor-not-allowed'
                                                                : 'border-slate-200 hover:border-slate-400 bg-white')
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-slate-900">{role.role_name}</h4>
                                                                {selectedRole === role.id && <FiCheck className="text-indigo-600" />}
                                                            </div>
                                                            <p className="text-xs text-slate-500 mb-2">{role.description}</p>
                                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${role.slots_filled >= role.slots_needed
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-green-100 text-green-700'
                                                                }`}>
                                                                {role.slots_filled >= role.slots_needed
                                                                    ? 'Full'
                                                                    : `${role.slots_needed - (role.slots_filled || 0)} spot${role.slots_needed - (role.slots_filled || 0) !== 1 ? 's' : ''} left`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {roles.length === 0 && selectedRole === null && (
                                    <div className="text-center py-6 text-slate-400 text-sm">
                                        <p>No volunteer roles available for this event.</p>
                                    </div>
                                )}

                                {error && <div className="text-red-500 mb-6 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

                                <Button
                                    onClick={handleConfirm}
                                    disabled={submitting}
                                    variant="primary"
                                    className="w-full justify-center py-3 text-base"
                                >
                                    {submitting ? 'Confirming...' : (selectedRole ? 'Confirm & Volunteer' : 'Complete Registration')}
                                </Button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mb-6 border border-green-100">
                                    <FiCheck size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-4">Registration Received</h1>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                                    Your details have been submitted.
                                    {event.cost > 0 && (
                                        <span className="block mt-4 font-semibold text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-100">
                                            Please visit the Finance Desk to pay <br />
                                            <span className="text-xl">KES {event.cost.toLocaleString()}</span>.
                                            <br /><span className="text-xs font-normal text-amber-800">Your official ticket will be granted upon payment confirmation.</span>
                                        </span>
                                    )}
                                    {!event.cost && " We look forward to seeing you there!"}
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button to="/dashboard" variant="outline">Go to Dashboard</Button>
                                    <Button to="/events" variant="secondary">Browse Events</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side: Event Preview */}
                <div className="order-1 lg:order-2">
                    <AnimatePresence mode="wait">
                        {step < 3 ? (
                            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 sticky top-12">
                                <div className="mb-6 rounded-xl overflow-hidden h-48 bg-slate-200">
                                    {event.banner_url ? (
                                        <img src={event.banner_url} alt="Event" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <FiCalendar size={48} />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{event.event_name}</h2>
                                <div className="flex flex-col gap-3 text-sm text-slate-600 mb-6 font-medium">
                                    <span className="flex items-center gap-2"><FiCalendar className="text-slate-400" /> {new Date(event.start_date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-2"><FiClock className="text-slate-400" /> {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center gap-2"><FiMapPin className="text-slate-400" /> {event.location}</span>
                                </div>

                                <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
                                    <span className="text-slate-500 font-medium">Entrance Fee</span>
                                    <span className="text-xl font-bold text-slate-900">{event.cost > 0 ? `KES ${event.cost.toLocaleString()}` : 'Free'}</span>
                                </div>
                            </div>
                        ) : (
                            <RegistrationReceipt event={event} user={user} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default EventRegistration;
