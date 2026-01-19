import React from 'react';
import { FiEye, FiTarget, FiHeart, FiUsers, FiShield, FiAward, FiSun, FiActivity, FiAnchor } from 'react-icons/fi';
import Button from '../../components/common/Button';

const About = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-primary-dark text-white py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
                    <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
                        About Spoken Word
                    </h1>
                    <p className="text-xl lg:text-2xl opacity-90 font-light max-w-2xl mx-auto">
                        Building a community of faith, hope, and love where everyone belongs.
                    </p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-primary">
                                    <FiEye size={24} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    To be a beacon of light in our community, transforming lives through the power of the Gospel and raising disciples who impact the world.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                                    <FiTarget size={24} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    We exist to worship God, disciple believers, and serve our neighbors with the tangible love of Jesus Christ.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Values</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Faith', icon: <FiSun />, desc: 'We walk by faith, trusting in God\'s promises and power.' },
                            { title: 'Love', icon: <FiHeart />, desc: 'We love God and love people, without condition or reservation.' },
                            { title: 'Community', icon: <FiUsers />, desc: 'We believe life is better together, united in Spirit.' },
                            { title: 'Service', icon: <FiActivity />, desc: 'We serve others with humility, just as Christ served us.' },
                            { title: 'Integrity', icon: <FiShield />, desc: 'We live with honesty and transparency in all we do.' },
                            { title: 'Excellence', icon: <FiAward />, desc: 'We offer our best to God in worship and work.' },
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group">
                                <div className="text-4xl mb-4 text-primary group-hover:scale-110 transition-transform duration-300 inline-block">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.desc}</p>
                            </div>
                        ))}
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
                            { name: 'Pastor John Doe', role: 'Senior Pastor', img: null },
                            { name: 'Pastor Jane Doe', role: 'Executive Pastor', img: null },
                            { name: 'Bishop Smith', role: 'Head of Ministries', img: null },
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
