import { useState } from 'react';
import AnnouncementList from '../../components/communication/AnnouncementList';
import CommunicationLogs from './CommunicationLogs';
import { motion, AnimatePresence } from 'framer-motion';

const Communication = () => {
    const [activeTab, setActiveTab] = useState('announcements');

    const tabs = [
        { id: 'announcements', label: 'Announcements' },
        { id: 'logs', label: 'Message Logs' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
                        >
                            Communication Center
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 mt-2 font-medium"
                        >
                            Manage announcements and track sent messages
                        </motion.p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 outline-none
                                ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                            `}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gray-100 rounded-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {activeTab === 'announcements' && <AnnouncementList />}
                        {activeTab === 'logs' && <CommunicationLogs />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Communication;
