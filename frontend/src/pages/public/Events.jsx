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
            {/* Header */}
            <section className="bg-primary text-white py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">Upcoming Events</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
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
                        <div className="space-y-8">
                            {events.map((event) => (
                                <div key={event.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row gap-8">
                                    {/* Date Badge */}
                                    <div className="flex flex-col items-center justify-center bg-blue-50 text-primary p-6 rounded-2xl min-w-[120px] h-fit self-start md:self-center">
                                        <span className="text-sm font-bold uppercase tracking-wider">{formatDate(event.start_date).month}</span>
                                        <span className="text-4xl font-black my-1">{formatDate(event.start_date).day}</span>
                                        <span className="text-sm font-medium text-gray-500">{new Date(event.start_date).getFullYear()}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                            <h2 className="text-2xl font-bold text-gray-900">{event.event_name}</h2>
                                            {event.registration_required && (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full">
                                                    Registration Required
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-4 text-sm font-medium">
                                            <span className="flex items-center gap-1">
                                                🕒 {formatDate(event.start_date).full} • {formatDate(event.start_date).time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                📍 {event.location || 'Main Sanctuary'}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4">
                                            {event.registration_required ? (
                                                <Button to={`/events/${event.id}/register`} variant="primary" size="medium">
                                                    Register Now
                                                </Button>
                                            ) : (
                                                <Button to="/contact" variant="outline" size="medium">
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
