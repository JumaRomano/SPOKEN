import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import financeService from '../../services/financeService';
import memberService from '../../services/memberService';

const ContributionRecorder = ({ isOpen, onClose, onContributionRecorded }) => {
    const [formData, setFormData] = useState({
        memberId: '',
        fundId: '',
        amount: '',
        contribution_type: 'offering',
        paymentMethod: 'cash',
        transactionRef: '',
        contributionDate: new Date().toISOString().split('T')[0],
        notes: '',
    });
    const [members, setMembers] = useState([]);
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const contributionTypes = [
        { value: 'tithe', label: 'Tithe' },
        { value: 'offering', label: 'Offering' },
        { value: 'donation', label: 'Donation' },
        { value: 'pledge_payment', label: 'Pledge Payment' },
        { value: 'other', label: 'Other' },
    ];

    const paymentMethods = [
        { value: 'cash', label: 'Cash' },
        { value: 'check', label: 'Check' },
        { value: 'mobile_money', label: 'Mobile Money' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'card', label: 'Card' },
    ];

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            fetchFunds();
        }
    }, [isOpen]);

    const fetchMembers = async () => {
        try {
            const data = await memberService.getAll({ limit: 500 });
            setMembers(data.members || data);
        } catch (err) {
            console.error('Error fetching members:', err);
        }
    };

    const fetchFunds = async () => {
        try {
            const data = await financeService.getFunds();
            // Filter only active funds
            setFunds(data.filter(f => f.is_active));
        } catch (err) {
            console.error('Error fetching funds:', err);
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
            await onContributionRecorded({
                memberId: formData.memberId,
                fundId: formData.fundId,
                amount: parseFloat(formData.amount),
                contribution_type: formData.contribution_type,
                paymentMethod: formData.paymentMethod,
                transactionRef: formData.transactionRef,
                contributionDate: formData.contributionDate,
                notes: formData.notes,
            });

            setFormData({
                memberId: '',
                fundId: '',
                amount: '',
                contribution_type: 'offering',
                paymentMethod: 'cash',
                transactionRef: '',
                contributionDate: new Date().toISOString().split('T')[0],
                notes: '',
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to record contribution');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Record Contribution">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {funds.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-sm">
                        ⚠️ No active funds available. Please create a fund first.
                    </div>
                )}

                <Select
                    label="Member"
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleChange}
                    options={[
                        { value: '', label: 'Select a member...' },
                        ...members.map(m => ({
                            value: m.id,
                            label: `${m.first_name} ${m.last_name}`
                        }))
                    ]}
                    required
                />

                <Select
                    label="Fund"
                    name="fundId"
                    value={formData.fundId}
                    onChange={handleChange}
                    options={[
                        { value: '', label: 'Select a fund...' },
                        ...funds.map(f => ({
                            value: f.id,
                            label: f.fund_name
                        }))
                    ]}
                    required
                    disabled={funds.length === 0}
                />

                <Input
                    label="Amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                />

                <Select
                    label="Contribution Type"
                    name="contribution_type"
                    value={formData.contribution_type}
                    onChange={handleChange}
                    options={contributionTypes}
                    required
                />

                <Select
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    options={paymentMethods}
                    required
                />

                <Input
                    label="Transaction Reference (Optional)"
                    name="transactionRef"
                    value={formData.transactionRef}
                    onChange={handleChange}
                    placeholder="Check #, Transaction ID, etc."
                />

                <Input
                    label="Contribution Date"
                    type="date"
                    name="contributionDate"
                    value={formData.contributionDate}
                    onChange={handleChange}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Optional)
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Additional notes..."
                    />
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
                        disabled={loading || funds.length === 0}
                    >
                        {loading ? 'Recording...' : 'Record Contribution'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ContributionRecorder;
