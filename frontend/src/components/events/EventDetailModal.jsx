import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const EventDetailModal = ({ event, isOpen, onClose }) => {
    if (!event) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event.event_name}>
            <div className="space-y-4">
                {/* Event Details */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Date</p>
                            <p className="text-base text-gray-900">{formatDate(event.start_date)}</p>
                            {event.end_date && event.end_date !== event.start_date && (
                                <p className="text-sm text-gray-600">to {formatDate(event.end_date)}</p>
                            )}
                        </div>

                        {event.start_date && (
                            <div>
                                <p className="text-sm font-medium text-gray-600">Time</p>
                                <p className="text-base text-gray-900">
                                    {new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                {event.location && (
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                        <p className="text-base text-gray-900">📍 {event.location}</p>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                        <p className="text-base text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}

                {/* Event Type */}
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Event Type</p>
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                        {event.event_type?.replace('_', ' ').toUpperCase()}
                    </span>
                </div>

                {/* Registration */}
                {event.registration_required && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                        <p className="text-sm font-medium text-green-800">
                            🎫 Registration Required
                        </p>
                        {event.max_participants && (
                            <p className="text-sm text-green-700 mt-1">
                                Limited to {event.max_participants} participants
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    {new Date(event.start_date) > new Date() && event.registration_required && (
                        <Button variant="primary">
                            Register Now
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default EventDetailModal;
