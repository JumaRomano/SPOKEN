import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { FiGrid, FiUsers, FiDollarSign, FiCheckSquare, FiVideo, FiHome, FiLogOut, FiMenu, FiX, FiMessageSquare } from 'react-icons/fi';
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
        { path: '/dashboard', label: 'Dashboard', icon: <FiGrid /> }, // Everyone sees dashboard
        { path: '/members', label: 'Members', icon: <FiUsers />, roles: ['admin', 'sysadmin'] },
        { path: '/groups', label: 'Groups', icon: <BiGroup /> }, // Everyone sees groups (filtered by backend)
        { path: '/finance', label: 'Finance', icon: <FiDollarSign />, roles: ['finance', 'admin', 'sysadmin'] },

        { path: '/attendance', label: 'Attendance', icon: <FiCheckSquare />, roles: ['leader', 'admin', 'sysadmin'] },
        // { path: '/communication', label: 'Communication', icon: <FiMessageSquare />, roles: ['secretary', 'admin', 'sysadmin'] },
        { path: '/sermons-management', label: 'Sermons', icon: <FiVideo />, roles: ['admin', 'sysadmin'] },
        { path: '/', label: 'Back to Website', icon: <FiHome /> }, // Everyone can go back
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
                    className="fixed inset-0 bg-secondary-dark/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-secondary-dark text-white flex flex-col shadow-2xl transition-transform duration-300 transform lg:transform-none border-r border-white/5",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-8 flex flex-col items-center text-center border-b border-white/5">
                    <img src={logo} alt="Logo" className="w-14 h-auto mb-4" />
                    <h2 className="text-lg font-bold m-0 leading-tight tracking-tight">The Spoken Word</h2>
                    <p className="text-xl text-slate-400 tracking-[0.2em] mt-1 uppercase font-medium">Ministries Portal</p>
                </div>

                <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
                    {filteredNav.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive(item.path)
                                    ? "bg-primary text-white shadow-soft"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <span className={clsx("text-lg transition-colors", isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-white")}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-5 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 p-3 rounded-lg mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold shadow-glow">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-sm font-semibold truncate" title={user?.email}>{user?.email?.split('@')[0]}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{user?.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-slate-300 hover:text-white"
                    >
                        <FiLogOut className="text-lg" />
                        Sign Out
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
