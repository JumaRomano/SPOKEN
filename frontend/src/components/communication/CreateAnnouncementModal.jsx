import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const CreateAnnouncementModal = ({ isOpen, onClose, onAnnouncementCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        priority: 'normal',
        target_audience: 'all',
        expires_at: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' },
    ];

    const audienceOptions = [
        { value: 'all', label: 'All Members' },
        { value: 'leaders', label: 'Leaders Only' },
        { value: 'members', label: 'Regular Members' },
        { value: 'volunteers', label: 'Volunteers' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onAnnouncementCreated(formData);
            setFormData({
                title: '',
                message: '',
                priority: 'normal',
                target_audience: 'all',
                expires_at: '',
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Announcement">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <Input
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Announcement title"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="5"
                        placeholder="Announcement message..."
                        required
                    />
                </div>

                <Select
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    options={priorityOptions}
                    required
                />

                <Select
                    label="Target Audience"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleChange}
                    options={audienceOptions}
                    required
                />

                <Input
                    label="Expiration Date (Optional)"
                    type="date"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleChange}
                />

                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Announcement'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateAnnouncementModal;
