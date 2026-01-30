import { useState, useEffect } from 'react';
import communicationService from '../../services/communicationService';
import Card from '../../components/common/Card';
import { motion } from 'framer-motion';

const CommunicationLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await communicationService.getCommunicationLogs({ limit, offset: page * limit });
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-700 border-green-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        return type === 'email' ? '📧' : '📱';
    };

    return (
        <Card title="Communication Logs" subtitle="History of sent messages and emails">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Recipient</th>
                            <th className="py-3 px-4">Message</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading && logs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">Loading logs...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">No logs found</td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <td className="py-3 px-4 font-medium text-gray-700">
                                        <span className="flex items-center gap-2">
                                            {getTypeIcon(log.communication_type)}
                                            <span className="capitalize">{log.communication_type}</span>
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {/* Ideally recipient name would be joined, but ID is what we have typically unless joined */}
                                        ID: {log.recipient_id}
                                    </td>
                                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                                        {log.message}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(log.status)}`}>
                                            {log.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-500">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-500">Page {page + 1}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={logs.length < limit}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </Card>
    );
};

export default CommunicationLogs;
