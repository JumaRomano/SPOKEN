import { useState, useEffect } from 'react';
import financeService from '../../services/financeService';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Select from '../common/Select';
import CreateFundModal from './CreateFundModal';

const FundManager = () => {
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [fundToDelete, setFundToDelete] = useState(null);
    const [targetFundId, setTargetFundId] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchFunds();
    }, []);

    const fetchFunds = async () => {
        setLoading(true);
        try {
            const data = await financeService.getFunds();
            setFunds(data);
        } catch (err) {
            console.error('Error fetching funds:', err);
            setMessage({ type: 'error', text: 'Failed to load funds' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFund = async (fundData) => {
        await financeService.createFund(fundData);
        setMessage({ type: 'success', text: 'Fund created successfully!' });
        fetchFunds();
    };

    const handleDeleteFund = async (fundId, fundName) => {
        if (window.confirm(`Are you sure you want to delete "${fundName}"? This cannot be undone.`)) {
            try {
                await financeService.deleteFund(fundId);
                setMessage({ type: 'success', text: 'Fund deleted successfully!' });
                fetchFunds();
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete fund';

                // If error is about contributions or pledges, offer reassignment
                if (errorMessage.includes('contributions') || errorMessage.includes('pledges')) {
                    setFundToDelete({ id: fundId, name: fundName });
                    setShowReassignModal(true);
                    setMessage({ type: 'error', text: errorMessage });
                } else {
                    setMessage({ type: 'error', text: errorMessage });
                }
            }
        }
    };

    const handleReassignAndDelete = async () => {
        if (!targetFundId) {
            setMessage({ type: 'error', text: 'Please select a target fund' });
            return;
        }

        if (targetFundId === fundToDelete.id) {
            setMessage({ type: 'error', text: 'Cannot reassign to the same fund' });
            return;
        }

        try {
            // Reassign contributions and pledges
            const result = await financeService.reassignFund(fundToDelete.id, targetFundId);
            setMessage({
                type: 'success',
                text: `Reassigned ${result.contributionsReassigned} contributions and ${result.pledgesReassigned} pledges`
            });

            // Now delete the fund
            await financeService.deleteFund(fundToDelete.id);
            setMessage({ type: 'success', text: 'Fund deleted successfully after reassignment!' });

            setShowReassignModal(false);
            setFundToDelete(null);
            setTargetFundId('');
            fetchFunds();
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to reassign or delete fund';
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    const formatCurrency = (amount) => {
        return `KSh ${(amount || 0).toLocaleString()}`;
    };

    return (
        <div className="space-y-6">
            {message.text && (
                <div
                    className={`px-4 py-3 rounded ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <Card
                title="Fund Management"
                subtitle="Manage church funds for contributions"
                actions={
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        Create Fund
                    </Button>
                }
            >
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading funds...</div>
                ) : funds.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💰</div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Funds Yet</h3>
                        <p className="text-gray-500 mb-4">
                            Create your first fund to start recording contributions
                        </p>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            Create Fund
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {funds.map((fund) => (
                            <div
                                key={fund.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900">{fund.fund_name}</h3>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded ${fund.is_active
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {fund.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-3">
                                    {fund.description || 'No description'}
                                </p>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Total Received:</span>
                                        <span className="font-semibold text-primary">
                                            {formatCurrency(fund.total_received)}
                                        </span>
                                    </div>
                                    {fund.target_amount > 0 && (
                                        <>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">Target:</span>
                                                <span className="font-semibold">
                                                    {formatCurrency(fund.target_amount)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            (fund.total_received / fund.target_amount) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-right">
                                                {Math.round((fund.total_received / fund.target_amount) * 100)}%
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                    <span className="text-xs text-gray-500 uppercase">
                                        {fund.fund_type?.replace('_', ' ')}
                                    </span>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={() => handleDeleteFund(fund.id, fund.fund_name)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <CreateFundModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onFundCreated={handleCreateFund}
            />

            <Modal
                isOpen={showReassignModal}
                onClose={() => {
                    setShowReassignModal(false);
                    setFundToDelete(null);
                    setTargetFundId('');
                }}
                title="Reassign Before Deletion"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                        <p className="text-sm text-yellow-800">
                            <strong>{fundToDelete?.name}</strong> has existing contributions or pledges.
                            Please select another fund to reassign them to before deletion.
                        </p>
                    </div>

                    <Select
                        label="Reassign to Fund"
                        value={targetFundId}
                        onChange={(e) => setTargetFundId(e.target.value)}
                        options={[
                            { value: '', label: 'Select a fund...' },
                            ...funds
                                .filter(f => f.id !== fundToDelete?.id && f.is_active)
                                .map(f => ({
                                    value: f.id,
                                    label: f.fund_name
                                }))
                        ]}
                        required
                    />

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowReassignModal(false);
                                setFundToDelete(null);
                                setTargetFundId('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleReassignAndDelete}
                            disabled={!targetFundId}
                        >
                            Reassign & Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FundManager;
