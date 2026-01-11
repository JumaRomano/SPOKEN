import { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getAll();
            setEvents(response.data || []);
        } catch (err) {
            setError('Failed to load events');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isUpcoming = (eventDate) => {
        return new Date(eventDate) > new Date();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="event-list-container">
            <Card
                title="Events & Programs"
                subtitle={`${events.length} events`}
                actions={<Button variant="primary">Create Event</Button>}
            >
                {loading ? (
                    <div className="loading-state">Loading events...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : events.length === 0 ? (
                    <div className="empty-state">No events scheduled</div>
                ) : (
                    <div className="events-timeline">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className={`event-card ${isUpcoming(event.eventStartDate) ? 'upcoming' : 'past'}`}
                            >
                                <div className="event-date-badge">
                                    <div className="badge-day">
                                        {new Date(event.eventStartDate).getDate()}
                                    </div>
                                    <div className="badge-month">
                                        {new Date(event.eventStartDate).toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                </div>

                                <div className="event-content">
                                    <div className="event-header-row">
                                        <h3 className="event-title">{event.title}</h3>
                                        <span className={`event-status ${isUpcoming(event.eventStartDate) ? 'upcoming' : 'past'}`}>
                                            {isUpcoming(event.eventStartDate) ? 'Upcoming' : 'Past'}
                                        </span>
                                    </div>

                                    {event.description && (
                                        <p className="event-description">{event.description}</p>
                                    )}

                                    <div className="event-details">
                                        <span className="event-detail">
                                            📅 {formatDate(event.eventStartDate)}
                                        </span>
                                        {event.startTime && (
                                            <span className="event-detail">
                                                🕐 {formatTime(event.startTime)}
                                            </span>
                                        )}
                                        {event.location && (
                                            <span className="event-detail">
                                                📍 {event.location}
                                            </span>
                                        )}
                                    </div>

                                    <div className="event-actions">
                                        <Button variant="secondary" size="small">View Details</Button>
                                        {isUpcoming(event.eventStartDate) && (
                                            <Button variant="primary" size="small">Register</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default EventList;
