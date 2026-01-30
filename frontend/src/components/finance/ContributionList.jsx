import { useState, useEffect } from 'react';
import financeService from '../../services/financeService';
import Card from '../common/Card';
import Select from '../common/Select';

const ContributionList = () => {
    const [contributions, setContributions] = useState([]);
    const [members, setMembers] = useState([]);
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        memberId: '',
        fundId: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchContributions();
    }, []);

    const fetchContributions = async () => {
        setLoading(true);
        try {
            const data = await financeService.getContributions({
                ...filters,
                limit: 100,
            });
            setContributions(data);
        } catch (err) {
            console.error('Error fetching contributions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        fetchContributions();
    };

    const handleClearFilters = () => {
        setFilters({
            memberId: '',
            fundId: '',
            startDate: '',
            endDate: '',
        });
        setTimeout(() => fetchContributions(), 100);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(amount || 0);
    };

    return (
        <Card title="Contribution History" subtitle="View all recorded contributions">
            {/* Filters */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Filters</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex items-end gap-2 md:col-span-2">
                        <button
                            onClick={handleApplyFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Apply
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Contributions Table */}
            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading contributions...</div>
            ) : contributions.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">💵</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Contributions Found</h3>
                    <p className="text-gray-500">
                        {filters.startDate || filters.endDate
                            ? 'Try adjusting your filters'
                            : 'No contributions have been recorded yet'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Member
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fund
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reference
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contributions.map((contribution) => (
                                <tr key={contribution.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(contribution.contribution_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {contribution.member_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {contribution.fund_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                        {formatCurrency(contribution.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {contribution.payment_method?.replace('_', ' ').toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {contribution.reference_number || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Total */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total:</span>
                        <span className="text-xl font-bold text-green-600">
                            {formatCurrency(
                                contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)
                            )}
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ContributionList;
