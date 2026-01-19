import { useState, useEffect } from 'react';
import communicationService from '../../services/communicationService';
import Card from '../common/Card';
import Button from '../common/Button';
import CreateAnnouncementModal from './CreateAnnouncementModal';

const AnnouncementList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await communicationService.getAnnouncements({ limit: 50 });
            setAnnouncements(data);
        } catch (err) {
            console.error('Error fetching announcements:', err);
            setMessage({ type: 'error', text: 'Failed to load announcements' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async (announcementData) => {
        await communicationService.createAnnouncement(announcementData);
        setMessage({ type: 'success', text: 'Announcement created successfully!' });
        fetchAnnouncements();
    };

    const handlePublish = async (id) => {
        try {
            await communicationService.publishAnnouncement(id);
            setMessage({ type: 'success', text: 'Announcement published!' });
            fetchAnnouncements();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to publish announcement' });
        }
    };

    const handleBroadcast = async (id) => {
        try {
            await communicationService.sendBroadcast(id, ['email', 'sms']);
            setMessage({ type: 'success', text: 'Broadcast sent successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send broadcast' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        try {
            await communicationService.deleteAnnouncement(id);
            setMessage({ type: 'success', text: 'Announcement deleted!' });
            fetchAnnouncements();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete announcement' });
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-700',
            normal: 'bg-blue-100 text-blue-700',
            high: 'bg-orange-100 text-orange-700',
            urgent: 'bg-red-100 text-red-700',
        };
        return colors[priority] || colors.normal;
    };

    return (
        <div className="space-y-6">
            {message.text && (
                <div
                    className={`px-4 py-3 rounded ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <Card
                title="Announcements"
                subtitle="Manage church announcements and broadcasts"
                actions={
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        Create Announcement
                    </Button>
                }
            >
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading announcements...</div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📢</div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Announcements Yet</h3>
                        <p className="text-gray-500 mb-4">
                            Create your first announcement to communicate with members
                        </p>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            Create Announcement
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {announcement.title}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                                    announcement.priority
                                                )}`}
                                            >
                                                {announcement.priority?.toUpperCase()}
                                            </span>
                                            {announcement.is_published && (
                                                <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                                                    PUBLISHED
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-2">{announcement.message}</p>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <span>Audience: {announcement.target_audience}</span>
                                            <span>
                                                Created: {new Date(announcement.created_at).toLocaleDateString()}
                                            </span>
                                            {announcement.expires_at && (
                                                <span>
                                                    Expires: {new Date(announcement.expires_at).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t">
                                    {!announcement.is_published && (
                                        <button
                                            onClick={() => handlePublish(announcement.id)}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Publish
                                        </button>
                                    )}
                                    {announcement.is_published && (
                                        <button
                                            onClick={() => handleBroadcast(announcement.id)}
                                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                                        >
                                            Send Broadcast
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(announcement.id)}
                                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <CreateAnnouncementModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onAnnouncementCreated={handleCreateAnnouncement}
            />
        </div>
    );
};

export default AnnouncementList;
