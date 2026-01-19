import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const CreateFundModal = ({ isOpen, onClose, onFundCreated }) => {
    const [formData, setFormData] = useState({
        fund_name: '',
        description: '',
        target_amount: '',
        fund_type: 'general',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fundTypes = [
        { value: 'general', label: 'General Fund' },
        { value: 'building', label: 'Building Fund' },
        { value: 'missions', label: 'Missions' },
        { value: 'special', label: 'Special Project' },
        { value: 'benevolence', label: 'Benevolence' },
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
            await onFundCreated(formData);
            setFormData({
                fund_name: '',
                description: '',
                target_amount: '',
                fund_type: 'general',
                is_active: true,
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create fund');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Fund">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <Input
                    label="Fund Name"
                    name="fund_name"
                    value={formData.fund_name}
                    onChange={handleChange}
                    placeholder="e.g., General Tithes, Building Project"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Purpose of this fund..."
                    />
                </div>

                <Select
                    label="Fund Type"
                    name="fund_type"
                    value={formData.fund_type}
                    onChange={handleChange}
                    options={fundTypes}
                    required
                />

                <Input
                    label="Target Amount (Optional)"
                    type="number"
                    name="target_amount"
                    value={formData.target_amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                />

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                        Active (can receive contributions)
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
                        {loading ? 'Creating...' : 'Create Fund'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateFundModal;
