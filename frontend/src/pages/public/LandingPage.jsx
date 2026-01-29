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
        <div className="flex flex-col min-h-screen font-sans smooth-scroll bg-white">
            {/* Hero Section - Clean & High Impact */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-secondary-dark text-white">
                {/* Abstract Professional Background */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary-dark blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary blur-[100px]"></div>
                </div>

                {/* Texture Overlay */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-200 text-xs font-medium tracking-wide mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        WELCOME TO SPOKEN WORD
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                        Experience a faith that <br />
                        <span className="text-blue-400">moves mountains.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        A vibrant community dedicated to authentic worship, deep spiritual growth, and serving our neighbors with love.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button to="/about" variant="primary" size="large" className="min-w-[160px] shadow-glow">
                            Our Mission
                        </Button>
                        <Button to="/contact" variant="outline" size="large" className="min-w-[160px] border-white/20 text-white hover:bg-white/10 hover:border-white">
                            Plan a Visit
                        </Button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                    <span className="text-xs uppercase tracking-widest text-slate-400">Scroll</span>
                    <FiArrowRight className="rotate-90 text-white" />
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

            {/* Featured Event Preview - Clean & Modern */}
            <section className="py-24 px-6 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl">
                            <span className="text-primary font-bold tracking-wider uppercase text-xs mb-3 block">Upcoming Highlights</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mb-4">Gather With Us</h2>
                            <p className="text-slate-600 text-lg leading-relaxed">Don't miss out on what God is doing in our midst.</p>
                        </div>
                        <Button to="/events" variant="outline" className="hidden md:flex group">
                            View Calendar <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {!loading && upcomingEvent ? (
                        <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 flex flex-col lg:flex-row">
                            {/* Stylish Date Column */}
                            <div className="bg-secondary-dark text-white p-10 flex flex-col items-center justify-center text-center min-w-[200px]">
                                <span className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-1">{formatDate(upcomingEvent.start_date).month}</span>
                                <span className="text-6xl font-black tracking-tighter">{formatDate(upcomingEvent.start_date).day}</span>
                                <span className="text-sm opacity-60 mt-2">{new Date(upcomingEvent.start_date).getFullYear()}</span>
                            </div>

                            {/* Main Content */}
                            <div className="p-8 lg:p-12 flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                    Next Event
                                </div>

                                <h3 className="text-2xl font-bold text-secondary-dark mb-4">{upcomingEvent.event_name}</h3>
                                <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-2xl">{upcomingEvent.description}</p>

                                <div className="flex flex-wrap gap-6 mb-8 text-slate-500 text-sm font-medium">
                                    <div className="flex items-center gap-2.5">
                                        <FiMapPin className="text-primary" />
                                        <span>{upcomingEvent.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <FiClock className="text-primary" />
                                        <span>{new Date(upcomingEvent.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <Button to={`/events/${upcomingEvent.id}`} variant="primary" size="large">
                                    RSVP Now
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl p-12 text-center border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 shadow-sm">
                                <FiClock className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-secondary-dark mb-2">No Upcoming Events</h3>
                            <p className="text-slate-500 mb-6">Check back soon for new announcements.</p>
                            <Button to="/events" variant="outline" size="small">
                                View Past Events
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
