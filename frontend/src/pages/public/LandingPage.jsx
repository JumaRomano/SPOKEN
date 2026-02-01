import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiArrowRight, FiVideo, FiHeart, FiUsers, FiSun } from 'react-icons/fi';
import Button from '../../components/common/Button';
import heroMobile from '../../assets/church_hero_mobile.png';


const LandingPage = () => {
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        // Delay video loading to prioritize content rendering
        const timer = setTimeout(() => {
            setVideoUrl("https://www.youtube.com/embed/pPpWmvBkinA?autoplay=1&mute=1&controls=0&loop=1&playlist=pPpWmvBkinA&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&vq=hd1080&hd=1&autohide=1&playsinline=1");
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-sans smooth-scroll bg-white">
            {/* Hero Section - Iridescent Spiritual Masterpiece */}
            <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden lg:bg-black bg-white transition-all duration-1000">
                {/* Background Artistry Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none touch-none overflow-hidden">
                    {/* Mobile: Iridescent Mesh & Glass Aesthetic */}
                    <div className="lg:hidden absolute inset-0 bg-white">
                        {/* Phase 1: Holographic Mesh Gradients (Ethereal shifting colors) */}
                        <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[60%] bg-[radial-gradient(circle_at_center,_rgba(186,230,253,0.3)_0%,_rgba(167,139,250,0.1)_50%,_transparent_100%)] blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[50%] bg-[radial-gradient(circle_at_center,_rgba(244,243,238,0.8)_0%,_rgba(191,219,254,0.2)_60%,_transparent_100%)] blur-[100px]"></div>

                        {/* Phase 2: Floating Glass Orbs - Adding Dimension */}
                        <motion.div
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[20%] right-[15%] w-32 h-32 bg-gradient-to-tr from-blue-100/30 to-purple-100/20 rounded-full blur-2xl"
                        ></motion.div>
                        <motion.div
                            animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[25%] left-[10%] w-48 h-48 bg-gradient-to-br from-indigo-50/40 to-blue-50/30 rounded-full blur-3xl opacity-60"
                        ></motion.div>

                        {/* Phase 3: The 'Path of Light' - Guiding User down */}
                        <div className="absolute left-[8%] top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-200/40 to-transparent"></div>
                        <motion.div
                            animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-[8%] w-[3px] h-20 bg-gradient-to-b from-blue-400 to-transparent -translate-x-1/2 blur-[2px]"
                        ></motion.div>
                    </div>

                    {/* Desktop Video Background - Preserved for High-End Desktop Feel */}
                    <div className="hidden lg:flex absolute inset-0 w-full h-full items-center justify-center bg-black">
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
                            {videoUrl && (
                                <iframe
                                    className="pointer-events-none border-none transition-opacity duration-1000 animate-in fade-in"
                                    src={videoUrl}
                                    allow="autoplay; encrypted-media"
                                    title="Hero Video Background"
                                    style={{
                                        width: '100vw',
                                        height: '56.25vw',
                                        minHeight: '100vh',
                                        minWidth: '177.77vh',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%) scale(1.0)',
                                        filter: 'contrast(1.02) brightness(1.05)',
                                    }}
                                ></iframe>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 z-10"></div>
                    </div>
                </div>

                {/* Content - Cinematic Typography & Glass Panels */}
                <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col justify-center min-h-[100svh] py-12 md:py-24">
                    <div className="flex flex-col items-center">
                        {/* Branded Pill - Iridescent/Glass Style */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-flex items-center gap-3 px-6 py-2 rounded-full lg:bg-white/10 bg-white/60 border lg:border-white/20 border-blue-100 backdrop-blur-xl lg:text-blue-300 text-primary text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-16 shadow-soft group hover:border-primary/30 transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></span>
                            A Sanctuary of Restoration
                        </motion.div>

                        {/* Mobile Title - High-End Magazine Style Layout */}
                        <div className="relative mb-16 lg:mb-20 flex flex-col items-center text-center">
                            {/* Mobile Title Backdrop Glow */}
                            <div className="lg:hidden absolute inset-0 -z-10 bg-blue-50/30 blur-[60px] rounded-full scale-110"></div>

                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                                className="text-[46px] sm:text-7xl md:text-8xl lg:text-[115px] font-black leading-[0.9] tracking-tighter lg:text-white text-secondary-dark"
                            >
                                <span className="block mb-4 lg:mb-6 opacity-60 lg:opacity-100">I shall stay</span>
                                <span className="block mb-4 lg:hidden relative">
                                    under the
                                    <span className="absolute -left-4 -right-4 bottom-1 h-3 bg-blue-500/10 -z-10"></span>
                                </span>
                                <span className="hidden lg:inline">under the </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-br lg:from-white from-primary lg:via-blue-200 via-blue-500 lg:to-blue-400 to-blue-900 drop-shadow-sm">
                                    Spoken Word of God.
                                </span>
                            </motion.h1>
                        </div>

                        {/* Description - Scriptural Promise Area */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.6 }}
                            className="max-w-[340px] sm:max-w-2xl mx-auto text-center"
                        >
                            <div className="relative inline-block">
                                <p className="text-[18px] sm:text-xl md:text-2xl lg:text-slate-100/90 text-slate-400 italic font-serif leading-relaxed tracking-tight lg:opacity-95">
                                    "I will restore to you the years that the swarmed locust has eaten."
                                </p>
                                <motion.span
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '40px' }}
                                    className="block h-[1px] bg-primary mx-auto my-4"
                                ></motion.span>
                                <span className="text-primary-dark lg:text-blue-300 font-black tracking-[0.3em] uppercase text-xs sm:text-sm">
                                    — Joel 2:25
                                </span>
                            </div>
                        </motion.div>

                        {/* Stunner Action Buttons - Twin Primary Style */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-col sm:flex-row gap-6 mt-16 items-center w-full max-w-[280px] sm:max-w-none justify-center"
                        >
                            <Button to="/about" variant="primary" size="large"
                                className="w-full sm:w-[240px] h-14 md:h-16 rounded-full text-base font-black shadow-[0_20px_40px_rgba(59,130,246,0.3)] lg:bg-transparent lg:border-2 lg:border-white/30 hover:scale-105 active:scale-95 transition-all text-white">
                                Discover Our Story
                            </Button>
                            <Button to="/contact" variant="primary" size="large"
                                className="w-full sm:w-[240px] h-14 md:h-16 rounded-full text-base font-black shadow-[0_20px_40px_rgba(59,130,246,0.3)] lg:bg-transparent lg:border-2 lg:border-white/30 hover:scale-105 active:scale-95 transition-all text-white">
                                Plan a Visit
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Animated Scroll Indicator - Only visible on Desktop or if desired */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 group">
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
                            { title: 'Worship With Us', text: 'Join us every Sunday at 9:00 AM & 11:30 AM for a time of refreshing.', link: '/contact', linkText: 'Plan Your Visit', accent: 'border-l-4 border-primary' },
                            { title: 'Sermon Library', text: 'Access our archive of life-changing messages and teachings anytime.', link: '/sermons', linkText: 'Watch Now', accent: 'border-l-4 border-primary' },
                        ].map((card, index) => (
                            <div key={index} className={`bg-white p-10 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 ${card.accent} group`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-secondary-dark tracking-tight">{card.title}</h3>
                                    <Link to={card.link} className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-primary transition-colors">
                                        {card.linkText} <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                                <p className="text-slate-600 text-lg leading-relaxed max-w-md">{card.text}</p>
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
