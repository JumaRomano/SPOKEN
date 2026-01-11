import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch public upcoming events
                // For now fetching all, assuming backend filters or we filter here
                const data = await eventService.getAll({ upcoming: true });
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
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="page-container">
            <div className="container">
                <section className="page-header">
                    <h1>Upcoming Events</h1>
                    <p className="lead">Join us for worship, fellowship, and special gatherings.</p>
                </section>

                {loading ? (
                    <div className="loading">Loading calendar...</div>
                ) : (
                    <div className="events-list">
                        {events.length > 0 ? events.map(event => (
                            <div key={event.id} className="event-item">
                                <div className="event-date-box">
                                    <span className="month">{new Date(event.start_date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                    <span className="day">{new Date(event.start_date).getDate()}</span>
                                </div>
                                <div className="event-content">
                                    <h2>{event.title}</h2>
                                    <p className="event-time">🕒 {formatDate(event.start_date)} {event.start_time ? `at ${event.start_time}` : ''}</p>
                                    <p className="event-location">📍 {event.location || 'Main Sanctuary'}</p>
                                    <p className="event-desc">{event.description}</p>
                                    {event.registration_required && (
                                        <button className="btn-rsvp">RSVP Required</button>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="no-data">
                                <p>No upcoming events scheduled at this time.</p>
                            </div>
                        )}
                    </div>
                )}

                <style>{`
                    .page-container { padding: 4rem 0; }
                    .page-header { text-align: center; margin-bottom: 4rem; }
                    .page-header h1 { font-size: 3rem; color: #1f2937; margin-bottom: 1rem; }
                    .lead { font-size: 1.25rem; color: #6b7280; }
                    .loading, .no-data { text-align: center; padding: 3rem; color: #6b7280; }
                    
                    .events-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                    .event-item { display: flex; background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                    .event-date-box { background: #eff6ff; color: #2563eb; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 100px; border-right: 1px solid #e5e7eb; }
                    .event-date-box .month { font-size: 1rem; font-weight: 700; }
                    .event-date-box .day { font-size: 2rem; font-weight: 800; line-height: 1; margin-top: 0.25rem; }
                    
                    .event-content { padding: 2rem; flex: 1; }
                    .event-content h2 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1f2937; }
                    .event-time, .event-location { color: #4b5563; margin-bottom: 0.5rem; font-size: 0.95rem; }
                    .event-desc { color: #6b7280; margin-top: 1rem; line-height: 1.6; }
                    
                    .btn-rsvp { margin-top: 1.5rem; background: #2563eb; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
                    .btn-rsvp:hover { background: #1d4ed8; }
                    
                    @media (max-width: 640px) {
                        .event-item { flex-direction: column; }
                        .event-date-box { flex-direction: row; gap: 1rem; padding: 1rem; border-right: none; border-bottom: 1px solid #e5e7eb; }
                        .event-date-box .day { margin-top: 0; font-size: 1.5rem; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Events;
