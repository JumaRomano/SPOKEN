import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const BroadcastModal = ({ isOpen, onClose, onSend, announcementTitle }) => {
    const [channels, setChannels] = useState({
        email: true,
        sms: true
    });

    const handleToggle = (channel) => {
        setChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
    };

    const handleSend = () => {
        const selectedChannels = Object.keys(channels).filter(c => channels[c]);
        if (selectedChannels.length === 0) {
            alert('Please select at least one channel');
            return;
        }
        onSend(selectedChannels);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send Broadcast">
            <div className="space-y-4">
                <p className="text-gray-600">
                    Choose how you want to broadcast: <strong className="text-gray-900">{announcementTitle}</strong>
                </p>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={channels.email}
                            onChange={() => handleToggle('email')}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div>
                            <span className="font-medium text-gray-900">Email</span>
                            <p className="text-xs text-gray-500">Send to all members with a registered email address</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={channels.sms}
                            onChange={() => handleToggle('sms')}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div>
                            <span className="font-medium text-gray-900">SMS (Africa's Talking)</span>
                            <p className="text-xs text-gray-500">Send text message to all members with a phone number</p>
                        </div>
                    </label>
                </div>

                <div className="flex gap-2 justify-end mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSend}>
                        Send Now
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default BroadcastModal;
