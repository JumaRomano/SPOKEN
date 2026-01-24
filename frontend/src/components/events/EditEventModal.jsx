import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const EditEventModal = ({ event, isOpen, onClose, onEventUpdated }) => {
    const [formData, setFormData] = useState({
        event_name: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        event_type: 'service',
        registration_required: false,
        max_participants: '',
        registration_deadline: '',
        cost: '',
        banner_url: ''
    });

    useEffect(() => {
        if (event) {
            setFormData({
                event_name: event.event_name || '',
                description: event.description || '',
                start_date: event.start_date ? event.start_date.slice(0, 16) : '',
                end_date: event.end_date ? event.end_date.slice(0, 16) : '',
                location: event.location || '',
                event_type: event.event_type || 'service',
                registration_required: event.registration_required || false,
                max_participants: event.max_participants || '',
                registration_deadline: event.registration_deadline ? event.registration_deadline.slice(0, 16) : '',
                cost: event.cost || '',
                banner_url: event.banner_url || '',
            });
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onEventUpdated(formData);
    };

    const eventTypes = [
        { value: 'service', label: 'Service' },
        { value: 'worship', label: 'Worship' },
        { value: 'prayer', label: 'Prayer Meeting' },
        { value: 'bible_study', label: 'Bible Study' },
        { value: 'youth', label: 'Youth Event' },
        { value: 'outreach', label: 'Outreach' },
        { value: 'conference', label: 'Conference' },
        { value: 'retreat', label: 'Retreat' },
        { value: 'social', label: 'Social Event' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Event">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Event Name"
                    name="event_name"
                    value={formData.event_name}
                    onChange={handleChange}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

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
                    />
                </div>



                <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Main Sanctuary, Fellowship Hall"
                />

                <Input
                    label="Banner Image URL"
                    name="banner_url"
                    value={formData.banner_url}
                    onChange={handleChange}
                    placeholder="https://..."
                />

                <Select
                    label="Event Type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    options={eventTypes}
                    required
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="registration_required"
                        name="registration_required"
                        checked={formData.registration_required}
                        onChange={handleChange}
                        className="rounded border-gray-300"
                    />
                    <label htmlFor="registration_required" className="text-sm font-medium text-gray-700">
                        Registration Required
                    </label>
                </div>

                {formData.registration_required && (
                    <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-blue-200">
                        <Input
                            label="Max Participants"
                            type="number"
                            name="max_participants"
                            value={formData.max_participants}
                            onChange={handleChange}
                            min="1"
                        />
                        <Input
                            label="Registration Deadline"
                            type="datetime-local"
                            name="registration_deadline"
                            value={formData.registration_deadline}
                            onChange={handleChange}
                        />
                        <Input
                            label="Cost"
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>
                )}

                <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Update Event
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditEventModal;
