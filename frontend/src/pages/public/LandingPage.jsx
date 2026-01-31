import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiArrowRight, FiVideo, FiHeart, FiUsers, FiSun } from 'react-icons/fi';
import Button from '../../components/common/Button';


const LandingPage = () => {


    return (
        <div className="flex flex-col min-h-screen font-sans smooth-scroll bg-white">
            {/* Hero Section - Senior Engineer Mobile Optimized Immersive Video */}
            <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black text-white px-safe">
                {/* Video Background Layer - Optimized for Internal Branding & Wide Screen Clarity */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none touch-none overflow-hidden bg-black">
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                        <iframe
                            className="pointer-events-none border-none transition-opacity duration-1000"
                            src="https://www.youtube.com/embed/pPpWmvBkinA?autoplay=1&mute=1&controls=0&loop=1&playlist=pPpWmvBkinA&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&vq=hd1080&hd=1&autohide=1&playsinline=1"
                            allow="autoplay; encrypted-media"
                            title="Hero Video Background"
                            style={{
                                width: '100vw',
                                height: '56.25vw', // 16:9
                                minHeight: '100vh',
                                minWidth: '177.77vh', // 16:9
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%) scale(1.0)', // Zero crop to preserve edge-to-edge text
                                filter: 'contrast(1.02) brightness(1.05)',
                            }}
                        ></iframe>
                    </div>

                    {/* Precision Overlays - Lightened significantly to reveal address & welcome text in video */}
                    <div className="absolute inset-0 bg-black/10 z-10"></div>

                    {/* Selective Vignette - Only darkens the top for header and bottom-center for buttons, leaving edges clear */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30 z-10"></div>

                    {/* Specialized Wide Screen Protection - Keeps video letters punchy on huge monitors */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10 hidden xl:block"></div>
                </div>

                {/* Content Container - Precision Adjusted for 9:16 Screens */}
                <div className="relative z-20 w-full max-w-6xl mx-auto px-6 py-10 md:py-24 
                    mt-[env(safe-area-inset-top)] mb-[env(safe-area-inset-bottom)] flex flex-col justify-center min-h-[100svh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center text-center -mt-12 md:mt-0"
                    >
                        {/* Branded Pill - Tighter for Mobile */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-300 text-[9px] md:text-xs font-black tracking-[0.2em] uppercase mb-8 md:mb-12 shadow-xl ring-1 ring-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse"></span>
                            Spoken Word of God Ministries
                        </div>

                        {/* Main Title - Optimized for vertical stacking on 9:16 */}
                        <h1 className="text-[38px] sm:text-6xl md:text-8xl lg:text-[100px] font-black mb-6 md:mb-10 leading-[1.1] md:leading-[1.05] tracking-tight md:tracking-tighter drop-shadow-2xl px-2">
                            I shall stay <br className="md:hidden" />
                            under the <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-300">
                                Spoken Word <br className="md:hidden" /> of God.
                            </span>
                        </h1>

                        {/* Mobile Optimized Text Container */}
                        <div className="max-w-[320px] sm:max-w-2xl mx-auto relative px-2">
                            <p className="text-sm sm:text-xl md:text-2xl text-slate-100/90 font-medium mb-12 leading-relaxed tracking-tight opacity-95">
                                A vibrant community dedicated to authentic worship,
                                <span className="hidden sm:inline"> deep spiritual growth, and serving our neighbors with love.</span>
                            </p>
                        </div>

                        {/* Mobile Optimized Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center w-full max-w-[280px] sm:max-w-none justify-center">
                            <Button to="/about" variant="outline" size="large"
                                className="w-full sm:w-[220px] h-14 md:h-16 rounded-full text-base md:text-lg font-bold border-white/30 text-white hover:bg-white/10 hover:border-white backdrop-blur-md transition-all duration-300 active:scale-95 shadow-lg">
                                Our Mission
                            </Button>
                            <Button to="/contact" variant="outline" size="large"
                                className="w-full sm:w-[220px] h-14 md:h-16 rounded-full text-base md:text-lg font-bold border-white/30 text-white hover:bg-white/10 hover:border-white backdrop-blur-md transition-all duration-300 active:scale-95 shadow-lg">
                                Plan a Visit
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Animated Scroll Indicator - Modern & Minimalist */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 group">
                    <div className="relative w-[1px] h-12 md:h-16 bg-white/10 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-500/50 animate-scroll-line"></div>
                    </div>
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
