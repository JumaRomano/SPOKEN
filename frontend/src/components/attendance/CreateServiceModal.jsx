import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import groupService from '../../services/groupService';

const CreateServiceModal = ({ isOpen, onClose, onServiceCreated }) => {
    const [formData, setFormData] = useState({
        service_date: new Date().toISOString().split('T')[0],
        service_time: '09:00',
        service_type: 'sunday_service',
        description: '',
        total_attendance: 0,
        group_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [groups, setGroups] = useState([]);

    const serviceTypes = [
        { value: 'sunday_service', label: 'Sunday Service' },
        { value: 'midweek_service', label: 'Midweek Service' },
        { value: 'prayer_meeting', label: 'Prayer Meeting' },
        { value: 'special_event', label: 'Special Event' },
    ];

    useEffect(() => {
        if (isOpen) {
            fetchGroups();
        }
    }, [isOpen]);

    const fetchGroups = async () => {
        try {
            const data = await groupService.getAll();
            setGroups(data.map(g => ({ value: g.id, label: g.name })));
        } catch (err) {
            console.error('Failed to fetch groups:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onServiceCreated(formData);
            setFormData({
                service_date: new Date().toISOString().split('T')[0],
                service_time: '09:00',
                service_type: 'sunday_service',
                description: '',
                total_attendance: 0,
                group_id: '',
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Service">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Service Date"
                        type="date"
                        name="service_date"
                        value={formData.service_date}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Time"
                        type="time"
                        name="service_time"
                        value={formData.service_time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Select
                    label="Service Type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    options={serviceTypes}
                    required
                />

                <Select
                    label="Group (Optional - leave blank for church-wide service)"
                    name="group_id"
                    value={formData.group_id}
                    onChange={handleChange}
                    options={[{ value: '', label: 'Church-Wide Service' }, ...groups]}
                />

                <Input
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., Morning Service, Youth Service"
                />

                <Input
                    label="Total Attendance (Optional)"
                    type="number"
                    name="total_attendance"
                    value={formData.total_attendance}
                    onChange={handleChange}
                    min="0"
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
                        {loading ? 'Creating...' : 'Create Service'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateServiceModal;
