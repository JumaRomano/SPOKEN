import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Button from '../common/Button';
import logo from '../../assets/logo.png';

const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/sermons', label: 'Sermons' },
        { path: '/events', label: 'Events' },
        { path: '/contact', label: 'Contact' },
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans text-secondary">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm h-[70px]">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 no-underline">
                        <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                        <div className="flex flex-col items-start">
                            <span className="text-xl font-extrabold text-primary leading-tight uppercase">The Spoken Word</span>
                            <span className="text-[10px] text-secondary font-bold tracking-widest uppercase">of God Ministries</span>
                        </div>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-2xl text-secondary focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={clsx(
                                    "font-medium transition-colors duration-200",
                                    isActive(link.path) ? "text-primary" : "text-secondary hover:text-primary"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/login">
                            <Button variant="outline" size="small">Member Portal</Button>
                        </Link>
                    </nav>
                </div>

                {/* Mobile Nav Overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-[70px] left-0 w-full bg-white shadow-md flex flex-col p-4 gap-2 animate-in slide-in-from-top-2 duration-200">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={clsx(
                                    "px-4 py-3 rounded-lg text-center font-medium",
                                    isActive(link.path) ? "bg-primary-light/10 text-primary" : "text-secondary"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-center">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                                <Button variant="outline" fullWidth>Member Portal</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-16 mt-auto">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div>
                        <h3 className="text-white text-xl font-bold mb-4">Spoken Word Of God Ministries</h3>
                        <p className="leading-relaxed mb-2">Empowering lives through the word of God. Join us for worship and fellowship.</p>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/sermons" className="hover:text-white transition-colors">Sermons</Link></li>
                            <li><Link to="/events" className="hover:text-white transition-colors">Calendar</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-4">Connect</h4>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/login" className="hover:text-white transition-colors">Member Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-4">Contact Info</h4>
                        <div className="space-y-2">
                            <p>Githurai Rurii Road</p>
                            <p>Nairobi, Kenya</p>
                            <p>Phone: 0724 453 995</p>
                            <p>Email: spokenmediahq@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 text-center text-sm">
                    <div className="max-w-7xl mx-auto px-6">
                        <p>&copy; {new Date().getFullYear()} Spoken Word Of God Ministries. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
