import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';

const EventRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // We use getById - ensure this endpoint is public or we handle error
                const data = await eventService.getById(id);
                setEvent(data);
            } catch (err) {
                console.error('Failed to fetch event', err);
                setError('Event not found or unavailable.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            // Redirect to login preserving the return url
            navigate('/login', { state: { from: `/events/${id}/register` } });
            return;
        }

        setRegistering(true);
        setError(null);

        try {
            await eventService.register(id, { memberId: user.memberId });
            setSuccess(true);
        } catch (err) {
            console.error('Registration failed', err);
            if (err.response?.status === 409) {
                setError('You are already registered for this event.');
            } else {
                setError('Failed to register. Please try again later.');
            }
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
                <FiAlertCircle className="text-4xl text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                <p className="text-gray-600 mb-6">The event you are looking for does not exist or has been removed.</p>
                <Button to="/events" variant="primary">Back to Events</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header Image/Color */}
                <div className="h-32 bg-secondary-dark relative">
                    <div className="absolute inset-0 bg-primary opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>

                <div className="p-8 -mt-12 relative z-10">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                            Event Registration
                        </span>
                        <h1 className="text-2xl md:text-3xl font-bold text-secondary-dark mb-4">{event.event_name}</h1>

                        <div className="flex flex-col gap-3 text-slate-600 text-sm font-medium items-center justify-center">
                            <div className="flex items-center gap-2">
                                <FiCalendar className="text-primary" />
                                {new Date(event.start_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <FiClock className="text-primary" />
                                {new Date(event.start_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-primary" />
                                {event.location || 'Main Sanctuary'}
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        {success ? (
                            <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                    <FiCheck size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-green-800 mb-2">Registration Confirmed!</h3>
                                <p className="text-green-700 mb-6">
                                    You have successfully registered for this event. We look forward to seeing you there.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button to="/dashboard" variant="outline">Go to Dashboard</Button>
                                    <Button to="/events" variant="primary">Browse More Events</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    {event.description}
                                </p>

                                {error && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm flex items-center gap-2 text-left">
                                        <FiAlertCircle className="flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {!isAuthenticated ? (
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                        <h3 className="text-blue-900 font-semibold mb-2">Login Required</h3>
                                        <p className="text-blue-700 text-sm mb-4">You need to sign in to your member account to register for this event.</p>
                                        <Button onClick={handleRegister} variant="primary" className="w-full justify-center">
                                            Sign In to Register
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleRegister}
                                        variant="primary"
                                        size="large"
                                        className="w-full justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        disabled={registering}
                                    >
                                        {registering ? 'Registering...' : 'Confirm Registration'}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventRegistration;
