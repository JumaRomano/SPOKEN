import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import groupService from '../../services/groupService';

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [memberTotals, setMemberTotals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                setLoading(true);
                const [groupData, membersData] = await Promise.all([
                    groupService.getById(id),
                    groupService.getMembers(id)
                ]);

                setGroup(groupData);
                setMembers(membersData || []);

                // Fetch member contributions
                try {
                    const contributionData = await groupService.getMemberContributions(id);
                    setContributions(contributionData.contributions || []);
                    setMemberTotals(contributionData.memberTotals || []);
                } catch (err) {
                    console.warn('Could not fetch member contributions', err);
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

    const handleDeleteGroup = async () => {
        try {
            setDeleting(true);
            await groupService.delete(id);
            navigate('/groups');
        } catch (err) {
            console.error('Error deleting group:', err);
            alert('Failed to delete group. Please try again.');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const canDelete = ['admin', 'sysadmin'].includes(user?.role);

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
                <div className="flex gap-3">
                    {canDelete && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-50 border border-red-200 px-4 py-2 rounded shadow-sm hover:bg-red-100 text-red-700 flex items-center gap-2 font-medium"
                        >
                            <FiTrash2 size={16} />
                            Delete Group
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/groups')}
                        className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-gray-700"
                    >
                        Back to List
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FiAlertCircle className="text-red-600" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Delete Group?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{group.name}</strong>? This action cannot be undone and will remove all associated data.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteGroup}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : (
                                    <>
                                        <FiTrash2 size={16} />
                                        Delete Group
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                {member.group_role || member.role}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {(member.joined_at || member.joined_date) ? new Date(member.joined_at || member.joined_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div className="space-y-8">
                        {/* Member Contribution Totals */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Member Contributions Summary</h3>
                            {memberTotals.length === 0 ? (
                                <p className="text-gray-500 italic">No contribution data available.</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Contributions</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {memberTotals.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {member.member_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                    KES {parseFloat(member.total_amount || 0).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {member.contribution_count || 0} contributions
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Recent Contributions */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Contributions</h3>
                            {contributions.length === 0 ? (
                                <p className="text-gray-500 italic">No recent contributions from group members.</p>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contributions.map((contrib) => (
                                            <tr key={contrib.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(contrib.contribution_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {contrib.member_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {contrib.fund_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                    KES {parseFloat(contrib.amount).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                    {contrib.payment_method?.replace('_', ' ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupDetail;
