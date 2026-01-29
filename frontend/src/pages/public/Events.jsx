import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventService.getPublicEvents({ upcoming: true });
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            day: date.getDate(),
            full: date.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header - Professional Hero with Overlay */}
            <section className="relative bg-secondary-dark text-white py-24 md:py-32 overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
                        alt="Worship event"
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/95 via-secondary-dark/80 to-secondary-dark"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                        Gather With Us
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">Upcoming Events</h1>
                    <p className="text-lg l:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                        Join us for worship, fellowship, and special gatherings. We'd love to see you there.
                    </p>
                </div>
            </section>

            {/* Events List */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : events.length > 0 ? (
                        <div className="space-y-6">
                            {events.map((event) => (
                                <div key={event.id} className="group bg-white rounded-xl p-0 shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col md:flex-row overflow-hidden">
                                    {/* Date Badge - Elegant & Distinct */}
                                    <div className="bg-slate-50 border-r border-slate-100 p-6 md:p-8 flex flex-col items-center justify-center min-w-[140px] text-center group-hover:bg-blue-50/50 transition-colors">
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{formatDate(event.start_date).month}</span>
                                        <span className="text-4xl font-black text-secondary-dark leading-none mb-2">{formatDate(event.start_date).day}</span>
                                        <span className="text-sm font-medium text-slate-400">{new Date(event.start_date).getFullYear()}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                            <h2 className="text-xl md:text-2xl font-bold text-secondary-dark group-hover:text-primary transition-colors">{event.event_name}</h2>
                                            {event.registration_required && (
                                                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                    Registration Required
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500 mb-6 text-sm font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-primary">🕒</span> {formatDate(event.start_date).full} • {formatDate(event.start_date).time}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-primary">📍</span> {event.location || 'Main Sanctuary'}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 mb-6 leading-relaxed text-base">
                                            {event.description}
                                        </p>

                                        <div className="flex flex-wrap gap-3 mt-auto">
                                            {event.registration_required ? (
                                                <Button to={`/events/${event.id}/register`} variant="primary" size="small">
                                                    Register Now
                                                </Button>
                                            ) : (
                                                <Button to="/contact" variant="outline" size="small" className="text-secondary-dark hover:text-primary">
                                                    Contact for Details
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">📅</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Events</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                We don't have any events scheduled right now. Please check back later or join us for our regular Sunday services.
                            </p>
                            <Button to="/contact" variant="primary">
                                Contact Us
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Events;
