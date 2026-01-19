import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'service',
        start_date: '',
        end_date: '',
        location: '',
        max_participants: '',
        registration_required: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const eventTypes = [
        { value: 'service', label: 'Church Service' },
        { value: 'conference', label: 'Conference' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'retreat', label: 'Retreat' },
        { value: 'social', label: 'Social Event' },
        { value: 'outreach', label: 'Outreach' },
        { value: 'meeting', label: 'Meeting' },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onEventCreated(formData);
            setFormData({
                title: '',
                description: '',
                event_type: 'service',
                start_date: '',
                end_date: '',
                location: '',
                max_participants: '',
                registration_required: false,
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Event">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <Input
                    label="Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Sunday Worship Service"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Event description..."
                        required
                    />
                </div>

                <Select
                    label="Event Type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    options={eventTypes}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Date & Time"
                        type="datetime-local"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="End Date & Time"
                        type="datetime-local"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Event location"
                    required
                />

                <Input
                    label="Max Participants (Optional)"
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    min="1"
                    placeholder="Leave empty for unlimited"
                />

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="registration_required"
                        checked={formData.registration_required}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                        Registration required
                    </label>
                </div>

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
                        {loading ? 'Creating...' : 'Create Event'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEventModal;
