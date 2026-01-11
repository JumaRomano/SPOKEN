import { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import groupService from '../../services/groupService';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        groupType: 'ministry',
        meetingSchedule: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            // Reset form
            setFormData({
                name: '',
                description: '',
                groupType: 'ministry',
                meetingSchedule: ''
            });
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
                    <div className="bg-danger-light/10 text-danger text-sm p-3 rounded-md">
                        {error}
                    </div>
                )}

                <Input
                    label="Group Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Youth Ministry"
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
                    placeholder="Brief description of the group's purpose..."
                />

                <Input
                    label="Meeting Schedule"
                    name="meetingSchedule"
                    value={formData.meetingSchedule}
                    onChange={handleChange}
                    placeholder="e.g. Every Friday at 6pm"
                />

                <div className="flex justify-end gap-3 pt-4">
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
