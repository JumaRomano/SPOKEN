import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiArrowRight, FiVideo, FiHeart, FiUsers, FiSun } from 'react-icons/fi';
import Button from '../../components/common/Button';
import eventService from '../../services/eventService';

const LandingPage = () => {
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const events = await eventService.getPublicEvents({ upcoming: true, limit: 1 });
                if (events && events.length > 0) {
                    setUpcomingEvent(events[0]);
                }
            } catch (error) {
                console.error('Failed to fetch upcoming event', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            day: date.getDate()
        };
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden">
                {/* Background Image & Gradient */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Worship Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 via-primary/80 to-black/60 mix-blend-multiply"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold tracking-wider mb-6 border border-white/30">
                        WELCOME HOME
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Experience God's <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Transforming Love</span>
                    </h1>
                    <p className="text-xl lg:text-2xl font-medium mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed text-blue-50">
                        A vibrant community dedicated to worship, spiritual growth, and serving our neighbors with the tangible love of Christ.
                    </p>
                    <p className="text-lg italic opacity-80 mb-1 max-w-2xl mx-auto font-serif">
                        "Thy word is a lamp unto my feet, and a light unto my path." <span className="not-italic block mt-1 text-sm font-sans font-bold uppercase tracking-widest opacity-70">- Psalm 119:105</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Button to="/about" variant="secondary" size="large" className="font-bold shadow-lg shadow-black/20 hover:shadow-black/40 transition-all transform hover:-translate-y-1 !bg-white/10 backdrop-blur-md border border-white/30 text-white hover:!bg-white hover:!text-primary-dark">
                            Our Mission
                        </Button>
                        <Button to="/events" variant="secondary" size="large" className="font-bold shadow-lg shadow-black/20 hover:shadow-black/40 transition-all transform hover:-translate-y-1 !bg-white/10 backdrop-blur-md border border-white/30 text-white hover:!bg-white hover:!text-primary-dark">
                            Upcoming Events
                        </Button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70">
                    <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </section>

            {/* Quick Access Cards */}
            <section className="bg-gray-50 pb-24 pt-12 lg:-mt-24 relative z-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Worship With Us', icon: <FiSun className="w-8 h-8" />, text: 'Join us every Sunday at 9:00 AM & 11:30 AM.', link: '/contact', linkText: 'Plan Your Visit', color: 'bg-amber-500' },
                        { title: 'Watch Sermons', icon: <FiVideo className="w-8 h-8" />, text: 'Catch up on recent messages and teachings.', link: '/sermons', linkText: 'Watch Now', color: 'bg-red-500' },
                        { title: 'Get Involved', icon: <FiUsers className="w-8 h-8" />, text: 'Find a ministry or small group to belong to.', link: '/ministries', linkText: 'Explore Groups', color: 'bg-green-500' },
                        { title: 'Give Online', icon: <FiHeart className="w-8 h-8" />, text: 'Support the work of the ministry securely.', link: '/giving', linkText: 'Give Now', color: 'bg-blue-500' },
                    ].map((card, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
                            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed text-sm">{card.text}</p>
                            <Link to={card.link} className="text-primary font-bold hover:text-primary-dark inline-flex items-center gap-2 group-hover:gap-3 transition-all text-sm uppercase tracking-wider">
                                {card.linkText} <FiArrowRight />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Event Preview */}
            <section className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 skew-x-12 transform translate-x-20 z-0"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-2xl">
                            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Mark Your Calendars</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-4">Upcoming Highlights</h2>
                            <p className="text-gray-600 text-lg">Don't miss out on what God is doing in our midst. Join us for these special gatherings.</p>
                        </div>
                        <Link to="/events" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors px-6 py-3 bg-blue-50 rounded-full">
                            View Full Calendar <FiArrowRight />
                        </Link>
                    </div>

                    {!loading && upcomingEvent ? (
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row group">
                            {/* Date & Info Sidebar */}
                            <div className="bg-primary text-white p-8 lg:p-12 flex flex-col items-center justify-center text-center lg:min-w-[250px] relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                                <div className="relative z-10">
                                    <span className="text-xl font-medium opacity-90 uppercase tracking-widest mb-2 block">{formatDate(upcomingEvent.start_date).month}</span>
                                    <span className="text-7xl font-black leading-none mb-4 block">{formatDate(upcomingEvent.start_date).day}</span>
                                    <div className="w-12 h-1 bg-white/50 mx-auto rounded-full mb-4"></div>
                                    <span className="text-sm font-bold opacity-80">{new Date(upcomingEvent.start_date).getFullYear()}</span>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4 text-sm font-bold text-primary bg-blue-50 w-fit px-4 py-1.5 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    NEXT EVENT
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">{upcomingEvent.event_name}</h3>
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl">{upcomingEvent.description}</p>

                                <div className="flex flex-wrap gap-6 mb-8 text-gray-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                                            <FiMapPin />
                                        </div>
                                        <span>{upcomingEvent.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                                            <FiClock />
                                        </div>
                                        <span>{new Date(upcomingEvent.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-8 mt-auto">
                                    <Button to={`/events/${upcomingEvent.id}`} variant="primary" size="large" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-1">
                                        RSVP / Register Now
                                    </Button>
                                </div>
                            </div>

                            {/* Map Preview (Desktop Only) */}
                            <div className="hidden lg:block w-1/3 relative min-h-[400px]">
                                <iframe
                                    title="Google Maps Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.9402566795456!2d36.9032249!3d-1.2055934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3fa47c4e4499%3A0xcf5472a0b991f5e8!2sSpoken%20Word%20Of%20God%20Ministries%2C%20Githurai%2044!5e0!3m2!1sen!2ske!4v1705000000000!5m2!1sen!2ske"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6 text-3xl">
                                📅
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Events</h3>
                            <p className="text-gray-500 text-lg mb-8 max-w-md">Our calendar is currently clearing up. Check back soon for new announcements!</p>
                            <Button to="/events" variant="outline" size="medium" className="transition-all transform hover:-translate-y-1 hover:bg-white hover:shadow-md">
                                View Past Events
                            </Button>
                        </div>
                    )}

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/events" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
                            View Full Calendar <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-dark">
                    <img
                        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Community"
                        className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wider mb-6 border border-white/20">BECOME A MEMBER</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Ready to Find Your Place?</h2>
                    <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed text-blue-100">
                        Experience the love of God in a welcoming family environment. Whether you're new to faith or looking for a home, we can't wait to meet you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Button to="/contact" variant="secondary" size="large" className="font-bold shadow-lg shadow-black/20 hover:shadow-black/40 transition-all transform hover:-translate-y-1">
                            Plan Your Visit
                        </Button>
                        <Button to="/login" variant="outline" size="large" className="bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-primary-dark font-bold transition-all transform hover:-translate-y-1">
                            Member Portal
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
