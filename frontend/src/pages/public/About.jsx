import React from 'react';
import { FiEye, FiTarget, FiHeart, FiUsers, FiShield, FiAward, FiSun, FiActivity, FiAnchor } from 'react-icons/fi';
import Button from '../../components/common/Button';

const About = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-secondary-dark text-white py-32 overflow-hidden">
                {/* Abstract Professional Background */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] rounded-full bg-primary-dark blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary blur-[100px]"></div>
                </div>

                {/* Texture Overlay */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
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
                                <div className="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-8 shadow-sm">
                                    <FiEye size={28} className="stroke-2" />
                                </div>
                                <h2 className="text-3xl font-bold text-secondary-dark mb-4">Our Vision</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    To be a beacon of light in our community, transforming lives through the power of the Gospel and raising disciples who impact the world with Kingdom vales.
                                </p>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="group bg-secondary-dark text-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/5 rounded-tl-full z-0 transition-transform group-hover:scale-150 duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 text-white rounded-xl flex items-center justify-center mb-8 backdrop-blur-md">
                                    <FiTarget size={28} className="stroke-2" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    We exist to worship God, disciple believers, and serve our neighbors with the tangible, life-changing love of Jesus Christ in action.
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
