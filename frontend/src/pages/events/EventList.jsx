import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';
import CreateEventModal from '../../components/events/CreateEventModal';
import EditEventModal from '../../components/events/EditEventModal';
import EventDetailModal from '../../components/events/EventDetailModal';
import { FiSearch, FiPlus, FiMapPin, FiClock, FiCalendar, FiUsers, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import './EventList.css';

const EventList = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [eventType, setEventType] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await eventService.getAll({
                search,
                eventType,
                upcoming: false // Fetch all for management
            });
            setEvents(data);
            setError('');
        } catch (err) {
            setError('Failed to load events. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, eventType]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchEvents]);

    const handleCreateEvent = async (formData) => {
        try {
            await eventService.create(formData);
            fetchEvents();
            setShowCreateModal(false);
        } catch (err) {
            console.error('Error creating event:', err);
            throw err; // Re-throw so modal can show error
        }
    };

    const handleUpdateEvent = async (formData) => {
        try {
            await eventService.update(selectedEvent.id, formData);
            fetchEvents();
            setShowEditModal(false);
            setSelectedEvent(null);
        } catch (err) {
            console.error('Error updating event:', err);
            throw err; // Re-throw so modal can show error
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await eventService.delete(id);
            fetchEvents();
        } catch (err) {
            alert('Failed to delete event');
        }
    };

    const isUpcoming = (date) => new Date(date) > new Date();

    const formatDateShort = (dateStr) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' })
        };
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'sysadmin' || user?.role === 'secretary';

    return (
        <div className="event-list-container">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Events Management</h1>
                    <p className="text-gray-500 mt-1">Manage church services, programs, and community events.</p>
                </div>
                {isAdmin && (
                    <Button
                        variant="primary"
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg shadow-indigo-100"
                    >
                        <FiPlus /> Create Event
                    </Button>
                )}
            </div>

            {/* Filters Bar */}
            <div className="event-search-bar">
                <div className="search-input-wrap">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search events by name or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="service">Worship Service</option>
                    <option value="ministry">Ministry Meeting</option>
                    <option value="outreach">Community Outreach</option>
                    <option value="other">Other Events</option>
                </select>
            </div>

            {/* Main Grid */}
            {loading && events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500 font-medium">Fetching upcoming events...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
                    <p className="text-red-600 font-bold mb-3">{error}</p>
                    <Button variant="outline" onClick={fetchEvents}>Retry</Button>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg">No events found matching your criteria.</p>
                </div>
            ) : (
                <div className="events-premium-grid">
                    {events.map((event) => {
                        const dateInfo = formatDateShort(event.start_date);
                        return (
                            <div key={event.id} className="event-card-premium">
                                <div className="event-banner">
                                    <img
                                        src={event.banner_url || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1400&auto=format&fit=crop"}
                                        alt={event.event_name}
                                    />
                                    <div className="event-date-overlay">
                                        <span className="overlay-day">{dateInfo.day}</span>
                                        <span className="overlay-month">{dateInfo.month}</span>
                                    </div>
                                    <span className="event-type-badge">{event.event_type}</span>
                                </div>

                                <div className="event-body">
                                    <div className="event-title-row">
                                        <h3>{event.event_name}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isUpcoming(event.start_date) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {isUpcoming(event.start_date) ? 'Upcoming' : 'Past'}
                                        </span>
                                    </div>

                                    <div className="event-meta">
                                        <div className="meta-item">
                                            <FiClock /> {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="meta-item">
                                            <FiMapPin /> {event.location || 'Spoken Word Ministry'}
                                        </div>
                                        {event.max_participants && (
                                            <div className="meta-item">
                                                <FiUsers /> Capacity: {event.registration_count}/{event.max_participants}
                                            </div>
                                        )}
                                    </div>

                                    <div className="event-footer">
                                        <div className="reg-stat">
                                            <FiExternalLink />
                                            <span>
                                                <span className="reg-count">{event.registration_count || 0}</span> Registered
                                            </span>
                                        </div>

                                        <div className="premium-btn-group">
                                            {isAdmin && (
                                                <>
                                                    <button
                                                        onClick={() => { setSelectedEvent(event); setShowEditModal(true); }}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                                        title="Edit Event"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id, event.event_name)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Delete Event"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={() => { setSelectedEvent(event); setShowDetailModal(true); }}
                                                className="!rounded-xl border-gray-200"
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <CreateEventModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onEventCreated={handleCreateEvent}
            />
            {selectedEvent && (
                <EditEventModal
                    isOpen={showEditModal}
                    event={selectedEvent}
                    onClose={() => { setShowEditModal(false); setSelectedEvent(null); }}
                    onEventUpdated={handleUpdateEvent}
                />
            )}
            {selectedEvent && (
                <EventDetailModal
                    isOpen={showDetailModal}
                    event={selectedEvent}
                    onClose={() => { setShowDetailModal(false); setSelectedEvent(null); }}
                />
            )}
        </div>
    );
};

export default EventList;
