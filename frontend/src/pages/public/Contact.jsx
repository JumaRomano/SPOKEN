import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct WhatsApp Message
        const phoneNumber = "254724453995";
        const text = `*New Inquiry from Website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Subject:* ${formData.subject}%0A*Message:* ${formData.message}`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;

        // Open in new tab
        window.open(whatsappUrl, '_blank');

        // Reset form (optional, depending on preference)
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                <section className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
                    <h1 className="font-bold text-secondary-dark tracking-tight">Contact Us</h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">We'd love to hear from you. Reach out with any questions, prayer requests, or just to say hello.</p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                    {/* Contact Info Side */}
                    <div className="lg:col-span-1 space-y-6 sm:space-y-8">
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5 sm:space-y-6">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-lg sm:text-xl flex-shrink-0">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-secondary-dark mb-1">Visit Us</h3>
                                    <p className="text-gray-600 text-sm sm:text-base">The Spoken Word of God Ministries</p>
                                    <p className="text-gray-600 text-sm sm:text-base">Nairobi, Kenya</p>
                                    <a href="https://maps.app.goo.gl/QQqDVDV9ZgqivVS96" target="_blank" rel="noreferrer" className="text-primary font-medium text-xs sm:text-sm mt-2 inline-block hover:underline min-h-[44px] flex items-center active-scale">
                                        View on Google Maps →
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-lg sm:text-xl flex-shrink-0">
                                    <FaPhone />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-secondary-dark mb-1">Call Us</h3>
                                    <p className="text-gray-600 font-medium text-sm sm:text-base">0724 453 995</p>
                                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Sun: 9:00 AM - 1:00 PM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-lg sm:text-xl flex-shrink-0">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-secondary-dark mb-1">Email Us</h3>
                                    <a href="mailto:spokenmediahq@gmail.com" className="text-gray-600 hover:text-primary transition-colors text-sm sm:text-base break-all active-scale">spokenmediahq@gmail.com</a>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed */}
                        <div className="w-full h-56 sm:h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
                            <iframe
                                title="Google Maps Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.9402566795456!2d36.9032249!3d-1.2055934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3fa47c4e4499%3A0xcf5472a0b991f5e8!2sSpoken%20Word%20Of%20God%20Ministries%2C%20Githurai%2044!5e0!3m2!1sen!2ske!4v1705000000000!5m2!1sen!2ske"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                className="grayscale group-hover:grayscale-0 transition-all duration-500"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form Side */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">
                            <h3 className="text-xl sm:text-2xl font-bold text-secondary-dark mb-5 sm:mb-6">Send a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-secondary">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            autoComplete="name"
                                            className="w-full px-4 py-4 text-base rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white touch-manipulation"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-secondary">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            inputMode="email"
                                            autoComplete="email"
                                            className="w-full px-4 py-4 text-base rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white touch-manipulation"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-semibold text-secondary">Subject</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 text-base rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none touch-manipulation"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Prayer Request">Prayer Request</option>
                                        <option value="New Visitor">I'm New Here</option>
                                        <option value="Feedback">Feedback</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-secondary">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-4 text-base rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white resize-none touch-manipulation"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 min-h-[52px] text-base touch-manipulation"
                                >
                                    <FaWhatsapp className="text-xl" />
                                    Send via WhatsApp
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
