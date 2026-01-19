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
        <Modal isOpen={isOpen} onClose={onClose} title={event.title}>
            <div className="space-y-4">
                {/* Event Details */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Date</p>
                            <p className="text-base text-gray-900">{formatDate(event.eventStartDate)}</p>
                            {event.eventEndDate && event.eventEndDate !== event.eventStartDate && (
                                <p className="text-sm text-gray-600">to {formatDate(event.eventEndDate)}</p>
                            )}
                        </div>

                        {event.startTime && (
                            <div>
                                <p className="text-sm font-medium text-gray-600">Time</p>
                                <p className="text-base text-gray-900">
                                    {formatTime(event.startTime)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
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
                        {event.eventType?.replace('_', ' ').toUpperCase()}
                    </span>
                </div>

                {/* Registration */}
                {event.requiresRegistration && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                        <p className="text-sm font-medium text-green-800">
                            🎫 Registration Required
                        </p>
                        {event.maxParticipants && (
                            <p className="text-sm text-green-700 mt-1">
                                Limited to {event.maxParticipants} participants
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    {new Date(event.eventStartDate) > new Date() && event.requiresRegistration && (
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
