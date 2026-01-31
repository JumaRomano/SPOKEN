import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiArrowRight, FiVideo, FiHeart, FiUsers, FiSun, FiCalendar } from 'react-icons/fi';
import Button from '../../components/common/Button';
import eventService from '../../services/eventService';

const LandingPage = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const events = await eventService.getPublicEvents({ upcoming: true, limit: 3 });
                setUpcomingEvents(events || []);
            } catch (error) {
                console.error('Failed to fetch upcoming events', error);
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
            weekday: date.toLocaleString('default', { weekday: 'short' })
        };
    };

    return (
        <div className="flex flex-col min-h-screen font-sans smooth-scroll bg-white">
            {/* Hero Section - Immersive Video Background */}
            <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-black text-white">
                {/* Video Background Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 w-full h-full scale-110">
                        <iframe
                            className="w-full h-full object-cover"
                            src="https://www.youtube.com/embed/pPpWmvBkinA?autoplay=1&mute=1&controls=0&loop=1&playlist=pPpWmvBkinA&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="Hero Video Background"
                            style={{
                                width: '100vw',
                                height: '56.25vw', // 16:9 Aspect Ratio
                                minHeight: '100vh',
                                minWidth: '177.77vh', // 16:9 Aspect Ratio
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        ></iframe>
                    </div>
                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10"></div>
                </div>

                {/* Content */}
                <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                            Spoken Word of God Ministries
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
                            I shall stay under the <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Spoken Word of God.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-200 font-medium mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
                            A vibrant community dedicated to authentic worship, deep spiritual growth, and serving our neighbors with love.
                        </p>

                        <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
                            <Button to="/about" variant="primary" size="large" className="min-w-[200px] h-14 rounded-full text-lg font-bold shadow-glow hover:scale-105 transition-transform">
                                Our Mission
                            </Button>
                            <Button to="/contact" variant="outline" size="large" className="min-w-[200px] h-14 rounded-full text-lg font-bold border-white/40 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all">
                                Plan a Visit
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 opacity-60">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-blue-400 to-transparent"></div>
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-200">Discover</span>
                </div>
            </section>

            {/* Feature Bento Grid */}
            <section className="py-20 bg-gray-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Worship With Us', icon: <FiSun className="w-6 h-6" />, text: 'Join us every Sunday at 9:00 AM & 11:30 AM for a time of refreshing.', link: '/contact', linkText: 'Plan Your Visit', accent: 'border-l-4 border-blue-500' },
                            { title: 'Sermon Library', icon: <FiVideo className="w-6 h-6" />, text: 'Access our archive of life-changing messages and teachings anytime.', link: '/sermons', linkText: 'Watch Now', accent: 'border-l-4 border-indigo-500' },
                        ].map((card, index) => (
                            <div key={index} className={`bg-white p-8 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 ${card.accent} group`}>
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-gray-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        {card.icon}
                                    </div>
                                    <Link to={card.link} className="flex items-center gap-2 text-sm font-semibold text-slate-500 group-hover:text-primary transition-colors">
                                        {card.linkText} <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                                <h3 className="text-xl font-bold text-secondary-dark mb-3">{card.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            <section className="py-24 px-6 bg-white border-t border-gray-100 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-xl text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-8 h-[2px] bg-primary"></span>
                                <span className="text-primary font-bold tracking-widest uppercase text-xs">The Gathering</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-secondary-dark mb-4 tracking-tight">Upcoming Highlights</h2>
                            <p className="text-slate-500 text-lg leading-relaxed">Experience a community where faith meets life. Join us for these special gatherings.</p>
                        </div>
                        <Button to="/events" variant="outline" className="group rounded-full px-8 py-3 font-bold border-2">
                            Full Calendar <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {!loading && upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.map((event) => {
                                const date = formatDate(event.start_date);
                                return (
                                    <div key={event.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                        {/* Image Section */}
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={event.image_url || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'}
                                                alt={event.event_name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Date Badge - Elegant Floating */}
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center min-w-[60px] shadow-lg border border-white/20">
                                                <span className="text-[10px] uppercase font-black text-primary tracking-widest leading-none mb-1">{date.month}</span>
                                                <span className="text-2xl font-black text-secondary-dark leading-none">{date.day}</span>
                                            </div>
                                            {/* Type Badge */}
                                            <div className="absolute bottom-4 left-4">
                                                <span className="px-3 py-1 bg-secondary-dark/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                                                    {event.event_type || 'Gathering'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-8 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-secondary-dark mb-3 group-hover:text-primary transition-colors duration-300">
                                                {event.event_name}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                                {event.description || 'Join us for a meaningful time of worship and community building as we explore faith together.'}
                                            </p>

                                            <div className="mt-auto space-y-3">
                                                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                        <FiClock size={14} />
                                                    </div>
                                                    <span>{date.weekday}, {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                        <FiMapPin size={14} />
                                                    </div>
                                                    <span className="truncate">{event.location || 'Main Sanctuary'}</span>
                                                </div>
                                            </div>

                                            <div className="h-[1px] bg-slate-100 my-6"></div>

                                            <Link
                                                to={`/events/${event.id}`}
                                                className="inline-flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-secondary-dark rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
                                            >
                                                Event Details <FiArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-slate-100 rounded-[2rem] p-16 text-center border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6 shadow-sm">
                                <FiCalendar className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary-dark mb-3">Community is Happening</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">We're currently planning our next gatherings. Check back shortly or join our mailing list for updates.</p>
                            <Button to="/events" variant="outline" size="large" className="rounded-full px-10">
                                View Previous Highlights
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Simple Powerful CTA */}
            <section className="py-24 bg-primary text-white text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-dark opacity-50 mix-blend-multiply"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to Find Your Place?</h2>
                    <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                        Experience the love of God in a welcoming family environment. Whether you're new to faith or looking for a home, you belong here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button to="/contact" variant="secondary" size="large" className="shadow-lg text-primary font-bold">
                            Plan Your Visit
                        </Button>
                        <Button to="/login" variant="outline" size="large" className="border-white text-white hover:bg-white/10">
                            Member Portal
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
