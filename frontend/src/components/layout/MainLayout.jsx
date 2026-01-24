import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { FiGrid, FiUsers, FiCalendar, FiDollarSign, FiCheckSquare, FiVideo, FiHome, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { BiGroup } from 'react-icons/bi';

import logo from '../../assets/logo.png';

const MainLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const navigation = [
        { path: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
        { path: '/members', label: 'Members', icon: <FiUsers />, roles: ['admin', 'sysadmin'] },
        { path: '/groups', label: 'Groups', icon: <BiGroup /> },
        { path: '/finance', label: 'Finance', icon: <FiDollarSign />, roles: ['finance', 'admin', 'sysadmin'] },
        { path: '/events', label: 'Events', icon: <FiCalendar /> },
        { path: '/attendance', label: 'Attendance', icon: <FiCheckSquare />, roles: ['leader', 'admin', 'sysadmin'] },
        { path: '/sermons-management', label: 'Sermons', icon: <FiVideo />, roles: ['admin', 'sysadmin'] },
        { path: '/', label: 'Back to Website', icon: <FiHome /> },
    ];

    const filteredNav = navigation.filter(item =>
        !item.roles || item.roles.includes(user?.role)
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Header & Overlay */}
            <div className="lg:hidden fixed top-0 w-full z-20 bg-gradient-to-r from-primary-gradientStart to-primary-gradientEnd text-white p-4 flex justify-between items-center shadow-md">
                <span className="font-bold text-lg">Spoken Word</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1 rounded hover:bg-white/10"
                >
                    {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-primary-gradientStart to-primary-gradientEnd text-white flex flex-col shadow-2xl transition-transform duration-300 transform lg:transform-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-8 border-b border-white/10 flex flex-col items-center text-center">
                    <img src={logo} alt="Logo" className="w-16 h-auto mb-3" />
                    <h2 className="text-xl font-bold m-0 leading-tight">The Spoken Word</h2>
                    <p className="text-[10px] opacity-70 tracking-[0.2em] mt-1 uppercase">of God Ministries</p>
                </div>

                <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
                    {filteredNav.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive(item.path)
                                    ? "bg-white/20 font-semibold shadow-inner"
                                    : "hover:bg-white/10 hover:translate-x-1"
                            )}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-5 border-t border-white/10 bg-black/5">
                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg mb-3">
                        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-lg font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-[13px] font-semibold truncate" title={user?.email}>{user?.email}</div>
                            <div className="text-[10px] opacity-80 uppercase tracking-wide">{user?.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2.5 bg-white/20 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden h-screen">
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
