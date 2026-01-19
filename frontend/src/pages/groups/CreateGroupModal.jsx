import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import groupService from '../../services/groupService';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
    const initialFormState = {
        name: '',
        description: '',
        groupType: 'ministry',
        meetingSchedule: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormState);
            setError('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await groupService.create(formData);
            onGroupCreated();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Group"
            size="medium"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                        {error}
                    </div>
                )}

                <Input
                    label="Group Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter group name"
                />

                <Select
                    label="Group Type"
                    name="groupType"
                    value={formData.groupType}
                    onChange={handleChange}
                    options={[
                        { value: 'ministry', label: 'Ministry' },
                        { value: 'fellowship', label: 'Fellowship' },
                        { value: 'committee', label: 'Committee' },
                        { value: 'department', label: 'Department' },
                        { value: 'other', label: 'Other' }
                    ]}
                />

                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    textarea
                    placeholder="Enter group description"
                />

                <Input
                    label="Meeting Schedule"
                    name="meetingSchedule"
                    value={formData.meetingSchedule}
                    onChange={handleChange}
                    placeholder="Enter meeting schedule (e.g. Every Friday)"
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Group'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateGroupModal;
