import React from 'react';
import { FiClock } from 'react-icons/fi';
import Button from '../../components/common/Button';

const About = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-secondary-dark text-white py-32 overflow-hidden">
                {/* High-Resolution Cinematic Building Backdrop */}
                <div className="absolute inset-0 z-0 bg-secondary-dark">
                    <img
                        src="/about-hero.jpg"
                        alt="Spoken Word Ministry Building"
                        className="w-full h-full object-cover"
                        style={{
                            filter: 'contrast(1.15) brightness(0.95) saturate(1.1) shadow(0 0 10px black)',
                            animation: 'subtle-zoom-out 30s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    />
                    {/* Precision Glass Mask - Darkens edges but keeps center clear for building branding */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.7)_80%)] z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/40 via-transparent to-secondary-dark z-10"></div>
                </div>

                {/* Inline CSS for the refined zoom-out animation */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes subtle-zoom-out {
                        from { transform: scale(1.15); }
                        to { transform: scale(1); }
                    }
                `}} />

                <div className="relative max-w-4xl mx-auto px-6 text-center z-10 py-20">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                        Who We Are
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
                        About Spoken Word
                    </h1>
                    <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                        Building a community of faith, hope, and love where everyone belongs and finds their purpose.
                    </p>
                </div>
            </section>

            {/* Vision & Mission - Bento Grid Style */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vision Card */}
                        <div className="group bg-white p-10 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 z-0 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-secondary-dark mb-4 mt-4 md:mt-0">Our Vision</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    To be a beacon of light in our community, transforming lives through the power of the Gospel and raising disciples who impact the world with Kingdom vales.
                                </p>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="group bg-secondary-dark text-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/5 rounded-tl-full z-0 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-white mb-4 mt-4 md:mt-0">Our Mission</h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    We exist to worship God, disciple believers, and serve our neighbors with the tangible, life-changing love of Jesus Christ in action.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Times & Scriptures */}
            <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Service Times */}
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-soft border border-slate-100 h-full">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                                <FiClock className="animate-pulse" /> Our Services
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-secondary-dark mb-10 tracking-tight">Gather With Us</h2>

                            <div className="space-y-10">
                                {[
                                    {
                                        day: "Sunday",
                                        items: [
                                            { name: "Intercessory Service", time: "6:00 AM - 7:00 AM" },
                                            { name: "1st Service", time: "8:00 AM - 10:00 AM" },
                                            { name: "2nd Main Service", time: "10:00 AM - 2:00 PM" }
                                        ]
                                    },
                                    {
                                        day: "Weekdays (Tue, Thu)",
                                        items: [
                                            { name: "Midweek Service", time: "2:00 PM - 5:00 PM" }
                                        ]
                                    }
                                ].map((service, idx) => (
                                    <div key={idx} className="relative pl-8 border-l-2 border-slate-100">
                                        <h3 className="text-xl font-bold text-secondary-dark mb-6 flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-full bg-primary absolute -left-[7px]"></span>
                                            {service.day}
                                        </h3>
                                        <div className="space-y-4">
                                            {service.items.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center group">
                                                    <span className="text-slate-600 font-medium group-hover:text-primary transition-colors">{item.name}</span>
                                                    <span className="px-3 py-1 rounded-lg bg-slate-50 text-secondary-dark text-sm font-bold border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                                                        {item.time}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scriptures / Faith Foundation */}
                        <div className="flex flex-col gap-8 h-full">
                            <div className="bg-secondary-dark text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden group h-full">
                                <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-bl-full z-0 group-hover:scale-125 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md border border-white/5">
                                        Faith Foundation
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black mb-10 tracking-tight leading-tight">Word of Restoration</h2>

                                    <div className="space-y-8">
                                        {[
                                            { ref: "Joel 2:25", text: "I will restore to you the years that the swarmed locust has eaten." },
                                            { ref: "Ezekiel 13:20", text: "Behold, I am against your magic bands with which you hunt souls like birds." },
                                            { ref: "Exodus 23:25", text: "Worship the Lord your God, and his blessing will be on your food and water." }
                                        ].map((scripture, idx) => (
                                            <div key={idx} className="relative border-b border-white/10 pb-8 last:border-0 last:pb-0">
                                                <p className="text-lg md:text-xl text-slate-300 italic mb-4 leading-relaxed font-medium">
                                                    "{scripture.text}"
                                                </p>
                                                <span className="text-primary-light font-black tracking-widest uppercase text-sm">
                                                    — {scripture.ref}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Guided by spirit-filled leaders dedicated to shepherding the flock of God.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Pastor ', role: 'Pastor', img: null },
                            { name: 'Reverend  ', role: 'Reverend', img: null },
                            { name: 'Bishop Joel Mandu ', role: 'Bishop', img: null },
                        ].map((leader, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[3/4] bg-gray-200">
                                {leader.img ? (
                                    <img src={leader.img} alt={leader.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                                        <svg className="w-20 h-20 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">Photo Coming Soon</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                                    <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                                    <p className="text-primary-light font-medium text-sm uppercase tracking-wider">{leader.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="bg-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-secondary-dark mb-4">Join Our Journey</h3>
                            <p className="text-gray-600 mb-6">
                                We'd love to get to know you better. Come visit us this Sunday!
                            </p>
                            <Button to="/contact" variant="primary" size="medium">
                                Plan Your Visit
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
