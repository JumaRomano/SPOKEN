import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiArrowRight, FiVideo, FiHeart, FiUsers, FiSun } from 'react-icons/fi';
import Button from '../../components/common/Button';
const LandingPage = () => {

    return (
        <div className="flex flex-col min-h-screen font-sans smooth-scroll bg-white">
            {/* Hero Section - Elegant Premium Design */}
            <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-slate-900">
                {/* Background Artistry Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none touch-none overflow-hidden">
                    {/* Unified Premium Church Interior Showcase */}
                    <div className="absolute inset-0 w-full h-full">
                        {/* Premium Image Treatment */}
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <motion.img
                                initial={{ scale: 1.05, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                                src="/church-interior-hero.png"
                                alt="Spoken Word Ministry Interior"
                                className="w-full h-full object-cover"
                                style={{
                                    filter: 'contrast(1.08) brightness(1) saturate(1.1)',
                                    objectPosition: 'center 45%',
                                }}
                            />
                        </div>

                        {/* Elegant Gradient Overlays - Magazine Style */}
                        {/* Sophisticated vignette with warm undertones */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,_transparent_0%,_rgba(15,23,42,0.6)_60%,_rgba(15,23,42,0.95)_100%)] z-10"></div>

                        {/* Refined top-to-bottom gradient for text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent via-40% to-slate-900/90 z-10"></div>

                        {/* Elegant side framing */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent via-50% to-slate-900/40 z-10"></div>

                        {/* Premium warm overlay for sophistication */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-indigo-950/20 z-10"></div>

                        {/* Elegant Corner Brackets - Luxury Touch */}
                        <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-white/20 z-20 hidden lg:block"></div>
                        <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-white/20 z-20 hidden lg:block"></div>
                        <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-white/20 z-20 hidden lg:block"></div>
                        <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-white/20 z-20 hidden lg:block"></div>

                        {/* Elegant Light Streaks */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 right-1/4 w-[1px] h-32 bg-gradient-to-b from-white/40 to-transparent z-20"
                        ></motion.div>
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-0 left-1/3 w-[1px] h-24 bg-gradient-to-b from-blue-300/30 to-transparent z-20"
                        ></motion.div>
                    </div>
                </div>

                {/* Content - Sophisticated Typography & Layout */}
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center min-h-[100svh] py-16">
                    <div className="flex flex-col items-center text-center">
                        {/* Premium Badge */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-slate-200 text-[11px] font-bold tracking-[0.35em] uppercase mb-12 lg:mb-16 shadow-2xl hover:border-white/20 transition-all duration-500 group"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] animate-pulse"></span>
                            <span className="group-hover:tracking-[0.4em] transition-all duration-300">A Sanctuary of Restoration</span>
                        </motion.div>

                        {/* Elegant Heading */}
                        <div className="relative mb-12 lg:mb-16">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
                                className="text-4xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[120px] font-black leading-[0.92] tracking-[-0.02em] text-white"
                            >
                                <span className="block mb-3 lg:mb-5">I shall stay</span>
                                <span className="block mb-3 lg:hidden relative">
                                    under the
                                    <span className="absolute -left-4 -right-4 bottom-1 h-3 bg-blue-500/20 -z-10 rounded"></span>
                                </span>
                                <span className="hidden lg:inline">under the </span>
                                <span className="relative inline-block mt-2 lg:mt-0">
                                    <span className="text-white">
                                        Spoken Word
                                    </span>
                                    {/* Elegant underline */}
                                    <motion.span
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                                        className="absolute -bottom-2 left-0 h-[2px] bg-blue-400 block"
                                    ></motion.span>
                                </span>
                                <span className="text-slate-100"> of God</span>
                            </motion.h1>
                        </div>

                        {/* Refined Scripture Quote */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="max-w-[360px] sm:max-w-2xl lg:max-w-3xl mx-auto mb-14 lg:mb-16"
                        >
                            <div className="relative inline-block px-6 lg:px-0">
                                {/* Elegant quotation marks */}
                                <span className="absolute -top-4 -left-2 lg:-left-6 text-5xl lg:text-6xl text-white/20 font-serif leading-none">"</span>
                                <p className="text-[17px] sm:text-xl lg:text-2xl text-slate-200 italic font-serif leading-relaxed tracking-wide">
                                    I will restore to you the years that the swarmed locust has eaten
                                </p>
                                <span className="absolute -bottom-8 -right-2 lg:-right-6 text-5xl lg:text-6xl text-white/20 font-serif leading-none">"</span>
                            </div>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 1.2 }}
                                className="w-16 h-[1px] bg-blue-400 mx-auto my-6"
                            ></motion.div>
                            <p className="text-blue-200 font-bold tracking-[0.25em] uppercase text-xs lg:text-sm">
                                Joel 2:25
                            </p>
                        </motion.div>

                        {/* Premium CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 1 }}
                            className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-[280px] sm:max-w-none mx-auto"
                        >
                            <Button to="/about" variant="outline" size="large"
                                className="w-full sm:w-auto px-10 h-14 lg:h-16 rounded-full text-sm lg:text-base font-bold tracking-wider border-2 border-white/30 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                Discover Our Story
                            </Button>
                            <Button to="/contact" variant="outline" size="large"
                                className="w-full sm:w-auto px-10 h-14 lg:h-16 rounded-full text-sm lg:text-base font-bold tracking-wider border-2 border-white/30 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                Plan Your Visit
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Elegant Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 group cursor-pointer"
                >
                    <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Scroll</span>
                    <div className="relative w-[1px] h-16 bg-white/10 overflow-hidden rounded-full">
                        <motion.div
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
                        ></motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Feature Bento Grid */}
            <section className="py-24 bg-slate-50 px-6 relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Experience the Word</h2>
                        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {[
                            { title: 'Worship With Us', text: 'Join us every Sunday at 9:00 AM & 11:30 AM for a time of refreshing in His presence.', link: '/contact', linkText: 'Plan Your Visit', delay: 0 },
                            { title: 'Sermon Library', text: 'Access our archive of life-changing messages and teachings anytime, anywhere.', link: '/sermons', linkText: 'Watch Now', delay: 0.2 },
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.7, delay: card.delay }}
                                className="relative bg-white/70 backdrop-blur-xl p-10 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-white/80 group overflow-hidden"
                            >
                                {/* Decorative Overlay on Hover */}
                                <div className="absolute inset-0 bg-transparent group-hover:bg-blue-50/50 transition-colors duration-500"></div>

                                {/* Accent Line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 transform origin-top scale-y-75 group-hover:scale-y-100 transition-transform duration-500"></div>

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{card.title}</h3>
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <FiArrowRight className="text-xl transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-lg leading-relaxed max-w-md mb-8">{card.text}</p>
                                    </div>
                                    <Link to={card.link} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider group-hover:text-indigo-700 transition-colors w-max">
                                        {card.linkText}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Simple Powerful CTA */}
            <section className="py-24 lg:py-32 px-6 relative overflow-hidden bg-slate-900">
                {/* Premium Dark Background */}
                <div className="absolute inset-0 bg-slate-900"></div>

                {/* Artistic Subtleties */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_50%)]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.15),_transparent_50%)]"></div>
                    {/* Noise Texture Overlay for Premium Feel */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgoJPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KCTxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4yIi8+Cjwvc3ZnPg==')]"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white">
                            Ready to Find <span className="text-blue-400">Your Place?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-blue-100/80 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
                            Experience the love of God in a welcoming family environment. Whether you're new to faith or looking for a home, you belong here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <Button to="/contact" size="large" className="w-full sm:w-auto px-10 h-14 lg:h-16 rounded-full text-base font-bold tracking-wider bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 border-none">
                                Plan Your Visit
                            </Button>
                            <Button to="/login" variant="outline" size="large" className="w-full sm:w-auto px-10 h-14 lg:h-16 rounded-full text-base font-bold tracking-wider border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                                Member Portal
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
