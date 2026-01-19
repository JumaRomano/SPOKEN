import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const EditEventModal = ({ event, isOpen, onClose, onEventUpdated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventStartDate: '',
        eventEndDate: '',
        startTime: '',
        endTime: '',
        location: '',
        eventType: 'service',
        requiresRegistration: false,
        maxParticipants: '',
        registrationDeadline: '',
        cost: '',
    });

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                eventStartDate: event.eventStartDate ? event.eventStartDate.split('T')[0] : '',
                eventEndDate: event.eventEndDate ? event.eventEndDate.split('T')[0] : '',
                startTime: event.startTime || '',
                endTime: event.endTime || '',
                location: event.location || '',
                eventType: event.eventType || 'service',
                requiresRegistration: event.requiresRegistration || false,
                maxParticipants: event.maxParticipants || '',
                registrationDeadline: event.registrationDeadline ? event.registrationDeadline.split('T')[0] : '',
                cost: event.cost || '',
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
                    label="Event Title"
                    name="title"
                    value={formData.title}
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
                        label="Start Date"
                        type="date"
                        name="eventStartDate"
                        value={formData.eventStartDate}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="End Date"
                        type="date"
                        name="eventEndDate"
                        value={formData.eventEndDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Start Time"
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                    />
                    <Input
                        label="End Time"
                        type="time"
                        name="endTime"
                        value={formData.endTime}
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

                <Select
                    label="Event Type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    options={eventTypes}
                    required
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="requiresRegistration"
                        name="requiresRegistration"
                        checked={formData.requiresRegistration}
                        onChange={handleChange}
                        className="rounded border-gray-300"
                    />
                    <label htmlFor="requiresRegistration" className="text-sm font-medium text-gray-700">
                        Requires Registration
                    </label>
                </div>

                {formData.requiresRegistration && (
                    <div className="grid grid-cols-2 gap-4 pl-6 border-l-2 border-blue-200">
                        <Input
                            label="Max Participants"
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            min="1"
                        />
                        <Input
                            label="Registration Deadline"
                            type="date"
                            name="registrationDeadline"
                            value={formData.registrationDeadline}
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
