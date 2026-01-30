import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiCheck, FiAlertCircle, FiArrowRight, FiUser, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';

// Mock Ticket Component
const Ticket = ({ event, user, qrCode }) => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-w-sm mx-auto relative group">
        {/* Top Gradient */}
        <div className="h-3 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500"></div>

        <div className="p-6 relative">
            {/* Watermark/Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Event Ticket</h3>
                    <h2 className="text-xl font-bold text-secondary-dark leading-tight">{event.event_name}</h2>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">🙏</div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary"><FiCalendar /></div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Date</p>
                        <p className="text-sm font-semibold text-slate-700">{new Date(event.start_date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><FiClock /></div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Time</p>
                        <p className="text-sm font-semibold text-slate-700">{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600"><FiMapPin /></div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                        <p className="text-sm font-semibold text-slate-700">{event.location}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-dashed border-slate-200 my-6 relative">
                <div className="absolute -left-8 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
                <div className="absolute -right-8 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-slate-900 p-2 rounded-lg mb-2">
                    {/* Placeholder QR */}
                    <div className="w-32 h-32 bg-white flex items-center justify-center">
                        <span className="font-mono text-3xl font-bold tracking-widest text-slate-800">SCAN ME</span>
                    </div>
                </div>
                <p className="text-xs text-slate-400 font-mono">ID: {user?.id?.slice(0, 8).toUpperCase() || 'GUEST'}</p>
            </div>
        </div>
        {/* Bottom Gold Bar */}
        <div className="h-2 bg-secondary-dark"></div>
    </div>
);

const EventRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

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
            // 1. Register for event
            await eventService.register(id, { memberId: user.memberId || user.id });

            // 2. Register for volunteer role if selected
            if (selectedRole) {
                await eventService.volunteerSignup(selectedRole, { memberId: user.memberId || user.id });
            }

            setStep(3); // Success!
        } catch (err) {
            console.error(err);
            if (err.response?.status === 409) {
                // Already registered, just move to success to show ticket
                setStep(3);
            } else {
                setError(err.response?.data?.message || 'Registration failed.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin text-4xl text-primary">●</div></div>;
    if (!event) return <div className="min-h-screen flex items-center justify-center text-red-500">Event not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left Side: Dynamic Content based on Step */}
                <div className="order-2 lg:order-1">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                            >
                                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Step 1 of 3</span>
                                <h1 className="text-3xl font-bold text-secondary-dark mb-6">Confirm Details</h1>

                                <div className="prose text-slate-600 mb-8">
                                    <p>{event.description || "Join us for this special gathering."}</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">👤</div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase">Attendee</p>
                                            <p className="font-semibold text-slate-800">{isAuthenticated ? (user.name || user.email) : 'Guest (Please Login)'}</p>
                                        </div>
                                    </div>
                                    {event.cost > 0 && (
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">💳</div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Cost</p>
                                                <p className="font-semibold text-slate-800">${event.cost}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button onClick={handleNext} variant="primary" className="w-full justify-center py-4 text-lg">
                                    {isAuthenticated ? 'Continue' : 'Login to Continue'} <FiArrowRight className="ml-2" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                            >
                                <button onClick={() => setStep(1)} className="text-slate-400 hover:text-primary mb-4 flex items-center gap-2 text-sm font-bold"><FiArrowLeft /> Back</button>
                                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Step 2 of 3</span>
                                <h1 className="text-3xl font-bold text-secondary-dark mb-2">Serve With Us</h1>
                                <p className="text-slate-500 mb-6">Volunteering is a great way to connect. (Optional)</p>

                                <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div
                                        onClick={() => setSelectedRole(null)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === null ? 'border-primary bg-blue-50/50 ring-1 ring-primary' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-slate-800">Just Attending</h3>
                                            {selectedRole === null && <FiCheck className="text-primary text-xl" />}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">I will participate as an attendee only.</p>
                                    </div>

                                    {roles.map(role => (
                                        <div
                                            key={role.id}
                                            onClick={() => role.slots_filled < role.slots_needed && setSelectedRole(role.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRole === role.id ? 'border-primary bg-blue-50/50 ring-1 ring-primary' : (role.slots_filled >= role.slots_needed ? 'opacity-50 border-slate-100 cursor-not-allowed hidden' : 'border-slate-100 hover:border-slate-300')}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-slate-800">{role.role_name}</h3>
                                                {selectedRole === role.id && <FiCheck className="text-primary text-xl" />}
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">{role.description}</p>
                                            <span className="inline-block mt-2 text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                                                {role.slots_needed - (role.slots_filled || 0)} spots left
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {error && <div className="text-red-500 mb-4 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                                <Button
                                    onClick={handleConfirm}
                                    disabled={submitting}
                                    variant="primary"
                                    className="w-full justify-center py-4 text-lg shadow-lg shadow-primary/20"
                                >
                                    {submitting ? 'Confirming...' : (selectedRole ? 'Confirm & Volunteer' : 'Complete Registration')}
                                </Button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6 animate-bounce-slow">
                                    <FiCheck size={40} />
                                </div>
                                <h1 className="text-4xl font-bold text-secondary-dark mb-4">You're In!</h1>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    Your registration has been confirmed. We've sent the details to your email.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button to="/dashboard" variant="outline">Go to Dashboard</Button>
                                    <Button to="/events" variant="secondary">Browse Events</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side: Event Preview / Ticket */}
                <div className="order-1 lg:order-2 sticky top-24">
                    <AnimatePresence mode="wait">
                        {step < 3 ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-secondary-dark rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                            >
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <img src={event.banner_url || "https://images.unsplash.com/photo-1544427920-24e832256df6?q=80&w=1500"} alt="bg" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-transparent to-transparent"></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 opacity-80">
                                        <div className="w-8 h-1 rounded-full bg-yellow-400"></div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-yellow-100/80">Event Preview</span>
                                    </div>

                                    <h2 className="text-3xl font-bold leading-tight mb-2">{event.event_name}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm font-medium text-blue-100/80 mb-8">
                                        <span className="flex items-center gap-2"><FiCalendar /> {new Date(event.start_date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-2"><FiMapPin /> {event.location}</span>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-slate-300 text-sm">General Admission</span>
                                            <span className="text-xl font-bold text-white">{event.cost > 0 ? `$${event.cost}` : 'Free'}</span>
                                        </div>
                                        <div className="h-px bg-white/10 w-full mb-4"></div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                            <FiHeart className="text-pink-400" />
                                            <span>We can't wait to see you!</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="ticket"
                                initial={{ opacity: 0, y: 50, rotate: 3 }}
                                animate={{ opacity: 1, y: 0, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                            >
                                <div className="text-center mb-6">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Your Ticket</span>
                                </div>
                                <Ticket event={event} user={user} qrCode="placeholder" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default EventRegistration;
