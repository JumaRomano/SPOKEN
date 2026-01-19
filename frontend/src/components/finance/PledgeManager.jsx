import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import memberService from '../../services/memberService';
import financeService from '../../services/financeService';

const PledgeManager = () => {
    const [pledges, setPledges] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        memberId: '',
        fundId: '',
        pledgeAmount: '',
        pledgeDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        notes: '',
    });
    const [members, setMembers] = useState([]);
    const [funds, setFunds] = useState([]);

    useEffect(() => {
        fetchPledges();
        fetchMembers();
        fetchFunds();
    }, []);

    const fetchPledges = async () => {
        try {
            setLoading(true);
            const data = await financeService.getAllPledges();
            setPledges(data);
        } catch (error) {
            console.error('Error fetching pledges:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const data = await memberService.getAll({ limit: 500 });
            setMembers(data.members || data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const fetchFunds = async () => {
        try {
            const data = await financeService.getFunds();
            setFunds(data.filter(f => f.is_active));
        } catch (error) {
            console.error('Error fetching funds:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await financeService.createPledge({
                member_id: formData.memberId,
                fund_id: formData.fundId,
                pledge_amount: parseFloat(formData.pledgeAmount),
                pledge_date: formData.pledgeDate,
                due_date: formData.dueDate || null,
                notes: formData.notes,
            });
            setShowModal(false);
            fetchPledges();
            setFormData({
                memberId: '',
                fundId: '',
                pledgeAmount: '',
                pledgeDate: new Date().toISOString().split('T')[0],
                dueDate: '',
                notes: '',
            });
        } catch (error) {
            console.error('Error creating pledge:', error);
            alert('Failed to create pledge');
        }
    };

    return (
        <>
            <Card
                title="Pledge Management"
                subtitle={`${pledges.length} active pledges`}
                actions={<Button variant="primary" onClick={() => setShowModal(true)}>Create Pledge</Button>}
            >
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : pledges.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🤝</div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Pledges Yet</h3>
                        <p className="text-gray-500 mb-4">Create your first pledge to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pledged</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pledges.map((pledge) => {
                                    const progress = (parseFloat(pledge.total_paid) / parseFloat(pledge.pledge_amount)) * 100;
                                    return (
                                        <tr key={pledge.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {pledge.first_name} {pledge.last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{pledge.fund_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                ${parseFloat(pledge.pledge_amount).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                ${parseFloat(pledge.total_paid).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                                        <div
                                                            className="bg-blue-600 h-2.5 rounded-full"
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {pledge.due_date ? new Date(pledge.due_date).toLocaleDateString() : 'No deadline'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Pledge">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    />

                    <Input
                        label="Pledge Amount"
                        type="number"
                        name="pledgeAmount"
                        value={formData.pledgeAmount}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                    />

                    <Input
                        label="Pledge Date"
                        type="date"
                        name="pledgeDate"
                        value={formData.pledgeDate}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Due Date (Optional)"
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="3"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Create Pledge
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default PledgeManager;
