import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-dark to-primary-light text-white py-24 lg:py-32 text-center overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-4xl mx-auto px-6 z-10">
                    <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Welcome to Spoken Word Of God Ministries
                    </h1>
                    <p className="text-xl lg:text-2xl font-medium mb-4 opacity-95">
                        A place of worship, community, and spiritual growth.
                    </p>
                    <p className="text-lg italic opacity-80 mb-10 max-w-2xl mx-auto">
                        "Thy word is a lamp unto my feet, and a light unto my path." - Psalm 119:105
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button to="/about" variant="secondary" size="large" className="font-bold">
                            Our Mission
                        </Button>
                        <Button to="/events" variant="outline" size="large" className="bg-transparent border-white text-white hover:bg-white hover:text-primary-dark">
                            Upcoming Events
                        </Button>
                    </div>
                </div>
            </section>

            {/* Quick Access Grid */}
            <section className="bg-gray-50 pb-20 pt-12 lg:-mt-16 relative z-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Worship With Us', text: 'Join us every Sunday at 9:00 AM & 11:30 AM.', link: '/contact', linkText: 'Plan Your Visit' },
                        { title: 'Watch Sermons', text: 'Catch up on recent messages and teachings.', link: '/sermons', linkText: 'Watch Now' },
                        { title: 'Get Involved', text: 'Find a ministry or small group to belong to.', link: '/ministries', linkText: 'Explore Groups' },
                        { title: 'Give Online', text: 'Support the work of the ministry securely.', link: '/giving', linkText: 'Give Now' },
                    ].map((card, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <h3 className="text-xl font-bold text-secondary-dark mb-3">{card.title}</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">{card.text}</p>
                            <Link to={card.link} className="text-primary font-semibold hover:text-primary-dark inline-flex items-center gap-1 group">
                                {card.linkText} <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Event Preview */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-100 pb-4 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-secondary-dark mb-2">Upcoming Events</h2>
                            <p className="text-gray-500">Don't miss out on what's happening.</p>
                        </div>
                        <Link to="/events" className="text-primary font-medium hover:underline">View Calendar →</Link>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center justify-center bg-blue-50 text-primary p-4 rounded-xl min-w-[90px]">
                            <span className="text-xs font-bold uppercase tracking-wider">Feb</span>
                            <span className="text-3xl font-black">14</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-secondary-dark mb-2">Test event</h3>
                            <iframe
                                title="Google Maps Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.9402566795456!2d36.9032249!3d-1.2055934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3fa47c4e4499%3A0xcf5472a0b991f5e8!2sSpoken%20Word%20Of%20God%20Ministries%2C%20Githurai%2044!5e0!3m2!1sen!2ske!4v1705000000000!5m2!1sen!2ske"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                className="grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg mb-4"
                            ></iframe>
                        </div>
                        <Button to="/events" variant="outline" size="medium" className="shrink-0 w-full md:w-auto">
                            RSVP Now
                        </Button>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 bg-primary text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Experience the love of God in a welcoming family environment. We can't wait to meet you.
                    </p>
                    <Button to="/contact" variant="secondary" size="large" className="font-bold shadow-xl">
                        Contact Us Today
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
