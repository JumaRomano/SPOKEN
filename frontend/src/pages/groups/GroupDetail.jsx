import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import groupService from '../../services/groupService';

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [finances, setFinances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                setLoading(true);
                // Finances might fail if user is not leader/admin, so we handle it gracefully or let the API decide
                // For now, allow parallel fetch but handle potential failures if needed
                const [groupData, membersData] = await Promise.all([
                    groupService.getById(id),
                    groupService.getMembers(id)
                ]);

                setGroup(groupData);
                setMembers(membersData || []);

                // Fetch finances separately to avoid blocking if 403
                try {
                    const financeData = await groupService.getFinances(id);
                    setFinances(financeData || []);
                } catch (err) {
                    console.warn('Could not fetch group finances (likely permission issue)', err);
                }

            } catch (err) {
                console.error('Error fetching group details:', err);
                setError('Failed to load group data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGroupData();
        }
    }, [id]);

    if (loading) return <div className="p-6 text-center">Loading group details...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!group) return <div className="p-6">Group not found.</div>;

    const TabButton = ({ name, label }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
                    <p className="text-gray-600">{group.group_type} • {members.length} Members</p>
                </div>
                <button
                    onClick={() => navigate('/groups')}
                    className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-gray-700"
                >
                    Back to List
                </button>
            </div>

            <div className="flex space-x-2 border-b border-gray-200 mb-6">
                <TabButton name="overview" label="Overview" />
                <TabButton name="members" label="Members" />
                <TabButton name="finance" label="Finances" />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'overview' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Group Information</h3>
                        <p className="mb-2"><span className="font-medium">Description:</span> {group.description || 'No description provided.'}</p>
                        <p className="mb-2"><span className="font-medium">Meeting Schedule:</span> {group.meeting_schedule || 'Not scheduled'}</p>
                        <p className="mb-2"><span className="font-medium">Status:</span> {group.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Group Members</h3>
                            {/* Potential "Add Member" button here */}
                        </div>
                        {members.length === 0 ? (
                            <p className="text-gray-500 italic">No members in this group.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/members/${member.member_id}`)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {member.first_name} {member.last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {member.role}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {member.joined_date ? new Date(member.joined_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Financial Records</h3>
                        {finances.length === 0 ? (
                            <p className="text-gray-500 italic">No financial records visible.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {finances.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(tx.transaction_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tx.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${tx.transaction_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {tx.transaction_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ${parseFloat(tx.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupDetail;
