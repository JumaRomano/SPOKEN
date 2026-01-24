import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CreateEventModal from '../../components/events/CreateEventModal';
import EditEventModal from '../../components/events/EditEventModal';
import EventDetailModal from '../../components/events/EventDetailModal';
import './EventList.css';

const EventList = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getAll();
            // Backend returns array directly, not wrapped in data
            setEvents(Array.isArray(response) ? response : (response.data || []));
        } catch (err) {
            setError('Failed to load events');
            console.error('Fetch events error:', err);
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

    const handleCreateEvent = async (eventData) => {
        try {
            await eventService.create(eventData);
            setMessage({ type: 'success', text: 'Event created successfully!' });
            fetchEvents();
        } catch (err) {
            console.error('Create event error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to create event';
            setMessage({ type: 'error', text: errorMsg });
            alert(`Error creating event: ${errorMsg}`);
        }
    };

    const handleUpdateEvent = async (eventData) => {
        try {
            await eventService.update(selectedEvent.id, eventData);
            setMessage({ type: 'success', text: 'Event updated successfully!' });
            setShowEditModal(false);
            setSelectedEvent(null);
            fetchEvents();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update event' });
        }
    };

    const handleDeleteEvent = async (eventId, eventTitle) => {
        if (window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
            try {
                await eventService.delete(eventId);
                setMessage({ type: 'success', text: 'Event deleted successfully!' });
                fetchEvents();
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to delete event' });
            }
        }
    };

    const canEdit = () => {
        return user?.role === 'admin' || user?.role === 'sysadmin';
    };

    const canDelete = () => {
        return user?.role === 'admin' || user?.role === 'sysadmin';
    };

    return (
        <div className="event-list-container">
            {message.text && (
                <div
                    className={`mb-4 px-4 py-3 rounded ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <Card
                title="Events & Programs"
                subtitle={`${events.length} events`}
                actions={canEdit() && <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Event</Button>}
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
                                        {canEdit() && (
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEvent(event);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {canDelete() && (
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteEvent(event.id, event.title);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedEvent(event);
                                                setShowDetailModal(true);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                        {isUpcoming(event.eventStartDate) && (
                                            <Button
                                                variant="primary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEvent(event);
                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                Register
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <CreateEventModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onEventCreated={handleCreateEvent}
            />

            <EditEventModal
                event={selectedEvent}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedEvent(null);
                }}
                onEventUpdated={handleUpdateEvent}
            />

            <EventDetailModal
                event={selectedEvent}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedEvent(null);
                }}
            />
        </div>
    );
};

export default EventList;

