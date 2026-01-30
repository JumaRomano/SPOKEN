import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiList, FiClock, FiMapPin, FiArrowRight, FiSearch, FiFilter } from 'react-icons/fi';
import eventService from '../../services/eventService';
import Button from '../../components/common/Button';

// Utility for calendar generation
const generateCalendarDays = (year, month) => {
    const date = new Date(year, month, 1);
    const day = date.getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Previous month padding
    for (let i = 0; i < day; i++) {
        days.push(null);
    }

    // Current month days
    for (let i = 1; i <= lastDay; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
};

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

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

    // Calendar Helper
    const eventsOnDay = (date) => {
        if (!date) return [];
        return events.filter(e => {
            const eDate = new Date(e.start_date);
            return eDate.getDate() === date.getDate() &&
                eDate.getMonth() === date.getMonth() &&
                eDate.getFullYear() === date.getFullYear();
        });
    };

    const calendarDays = generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth());

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-slate-800">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-secondary-dark text-white">
                {/* Abstract Professional Background */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary-dark blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary blur-[100px]"></div>
                </div>

                {/* Texture Overlay */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-2xl">
                            Experience the Divine
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Events & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Gatherings</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200/90 max-w-2xl mx-auto leading-relaxed font-light">
                            Discover moments of connection, spiritual growth, and community celebration.
                            There is a place for you here.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CONTROLS BAR - Floating Glass */}
            <div className="sticky top-20 z-30 px-6 -mt-8 pointer-events-none">
                <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 pointer-events-auto">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none md:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Find an event..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
                            <FiFilter />
                        </button>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-secondary-dark shadow-sm' : 'text-slate-500 hover:text-secondary-dark'}`}
                        >
                            <FiList /> List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-secondary-dark shadow-sm' : 'text-slate-500 hover:text-secondary-dark'}`}
                        >
                            <FiCalendar /> Calendar
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <section className="py-12 md:py-20 px-6">
                <div className="max-w-6xl mx-auto">

                    {viewMode === 'calendar' && (
                        <div className="animate-fade-in-up">
                            {/* Simple Calendar View Implementation */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h2 className="text-2xl font-bold text-secondary-dark">
                                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:shadow-sm">← Prev</button>
                                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-500 hover:shadow-sm">Next →</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                                </div>
                                <div className="grid grid-cols-7 min-h-[500px]">
                                    {calendarDays.map((day, idx) => {
                                        const dayEvents = eventsOnDay(day);
                                        const isToday = day && day.toDateString() === new Date().toDateString();

                                        return (
                                            <div
                                                key={idx}
                                                className={`min-h-[120px] p-2 border-b border-r border-slate-50 hover:bg-blue-50/30 transition-colors relative group ${!day ? 'bg-slate-50/50' : ''}`}
                                            >
                                                {day && (
                                                    <>
                                                        <span className={`text-sm font-semibold inline-block w-8 h-8 rounded-full flex items-center justify-center mb-1 ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-700'}`}>
                                                            {day.getDate()}
                                                        </span>
                                                        <div className="space-y-1">
                                                            {dayEvents.map(ev => (
                                                                <Link
                                                                    to={ev.registration_required ? `/events/${ev.id}/register` : '/contact'}
                                                                    key={ev.id}
                                                                    className="block text-[10px] bg-white border border-blue-100 text-secondary-dark px-2 py-1.5 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all truncate font-medium relative overflow-hidden"
                                                                >
                                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                                                    <span className="pl-1">{ev.event_name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'list' && (
                        <div className="grid grid-cols-1 gap-8">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin text-primary text-4xl">●</div>
                                </div>
                            ) : events.length > 0 ? (
                                events.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative bg-white rounded-3xl p-0 shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row h-full">
                                            {/* Date Column */}
                                            <div className="bg-slate-50/50 p-8 flex flex-col items-center justify-center min-w-[150px] border-b md:border-b-0 md:border-r border-slate-100 group-hover:bg-blue-50/30 transition-colors">
                                                <span className="text-secondary-dark font-black text-5xl tracking-tighter mb-1">{formatDate(event.start_date).day}</span>
                                                <span className="text-primary font-bold uppercase tracking-widest text-xs">{formatDate(event.start_date).month}</span>
                                                <span className="text-slate-400 font-medium text-xs mt-2">{new Date(event.start_date).getFullYear()}</span>
                                            </div>

                                            {/* Content Column */}
                                            <div className="flex-1 p-8 flex flex-col justify-center relative">
                                                {/* Decorative background blob */}
                                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors duration-500"></div>

                                                <div className="relative z-10">
                                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                        <h3 className="text-2xl font-bold text-secondary-dark group-hover:text-primary transition-colors duration-300">
                                                            {event.event_name}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.registration_required ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                                {event.registration_required ? 'Registration Required' : 'Open to All'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-6 mb-6 text-sm text-slate-500 font-medium">
                                                        <span className="flex items-center gap-2">
                                                            <FiClock className="text-primary" />
                                                            {formatDate(event.start_date).full} • {formatDate(event.start_date).time}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <FiMapPin className="text-primary" />
                                                            {event.location || 'Main Sanctuary'}
                                                        </span>
                                                    </div>

                                                    <p className="text-slate-600 mb-8 max-w-2xl leading-relaxed">
                                                        {event.description}
                                                    </p>

                                                    <div className="flex items-center gap-4">
                                                        <Button to={`/events/${event.id}/register`} variant="primary" className="shadow-lg shadow-primary/20 hover:shadow-primary/40">
                                                            {event.registration_required ? 'Reserve Your Place' : 'View Details & RSVP'} <FiArrowRight className="ml-2" />
                                                        </Button>

                                                        {event.cost > 0 && (
                                                            <span className="text-slate-800 font-bold ml-4">
                                                                KES {event.cost.toLocaleString()} <span className="text-slate-400 font-normal text-xs">/ person</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FiCalendar className="text-3xl text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Upcoming Events</h3>
                                    <p className="text-slate-500 mb-6">Unfolding grace. Check back soon for new gatherings.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Events;
