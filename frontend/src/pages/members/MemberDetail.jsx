import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import memberService from '../../services/memberService';
import groupService from '../../services/groupService';
import { FiArrowLeft, FiUser, FiCalendar, FiDollarSign, FiClock, FiMail, FiPhone, FiMapPin, FiActivity, FiEdit, FiUsers, FiLock } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MemberModal from './CreateMemberModal';
// Dynamic import of authService is handled inside the component to avoid circular dependencies if any, 
// strictly speaking it's better to import at top if no circular dep. 
// But I will import it at top here.
import authService from '../../services/authService';

const MemberDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [memberGroups, setMemberGroups] = useState([]); // Member's groups
    const [allGroups, setAllGroups] = useState([]); // Available groups for selection
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(''); // For assignment
    const [assigningGroup, setAssigningGroup] = useState(false);

    const fetchMemberData = async () => {
        try {
            setLoading(true);
            const [memberData, attendanceData, contributionData, groupData] = await Promise.all([
                memberService.getById(id),
                memberService.getAttendance(id).catch(() => []),
                memberService.getContributions(id).catch(() => ({ contributions: [] })),
                memberService.getGroups(id).catch(() => [])
            ]);

            setMember(memberData);
            setAttendance(attendanceData || []);
            setContributions(contributionData?.contributions || []);
            setMemberGroups(groupData || []);
        } catch (err) {
            console.error('Error fetching member details:', err);
            setError('Failed to load member data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch all groups for the dropdown
    useEffect(() => {
        const fetchAllGroups = async () => {
            try {
                const res = await groupService.getAll();
                setAllGroups(res.groups || []); // Extract groups array
            } catch (err) {
                console.error("Failed to fetch groups", err);
                setAllGroups([]); // Ensure it's always an array
            }
        };
        fetchAllGroups();
    }, []);

    const handleAssignGroup = async () => {
        if (!selectedGroupId) return;
        setAssigningGroup(true);
        try {
            await groupService.addMember(selectedGroupId, member.id);
            // Refresh member groups
            const updatedGroups = await memberService.getGroups(member.id);
            setMemberGroups(updatedGroups);
            setSelectedGroupId('');
            alert('Member assigned to group successfully!');
        } catch (err) {
            console.error('Error assigning group:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to assign member to group';
            alert(`Error: ${errorMsg}`);
        } finally {
            setAssigningGroup(false);
        }
    };

    const handleRemoveGroup = async (groupId) => {
        if (!window.confirm('Are you sure you want to remove the member from this group?')) return;
        try {
            await groupService.removeMember(groupId, member.id);
            // Refresh member groups
            const updatedGroups = await memberService.getGroups(member.id);
            setMemberGroups(updatedGroups);
        } catch (err) {
            console.error('Error removing group:', err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMemberData();
        }
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500">Loading member details...</p>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-50 border border-red-100 rounded-xl text-center">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <Button variant="outline" onClick={() => navigate('/members')}>Back to Members</Button>
        </div>
    );

    if (!member) return <div className="p-6 text-center">Member not found.</div>;

    // Helper to safely get properties regardless of casing (handling backend inconsistencies)
    const getProp = (obj, snake, camel) => obj?.[snake] || obj?.[camel];

    const firstName = getProp(member, 'first_name', 'firstName');
    const lastName = getProp(member, 'last_name', 'lastName');
    const email = member.email;
    const phone = member.phone;
    const address = member.address;
    const membershipStatus = getProp(member, 'membership_status', 'membershipStatus');
    const membershipDate = getProp(member, 'membership_date', 'membershipDate');

    const TabButton = ({ name, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === name
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-6">
            <MemberModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onMemberSaved={fetchMemberData}
                member={member}
            />

            {/* Header / Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary-gradientStart to-primary-gradientEnd"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                                    {firstName?.charAt(0)}{lastName?.charAt(0)}
                                </div>
                            </div>
                            <div className="mb-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {firstName} {lastName}
                                </h1>
                                <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
                                    {(email) && <span className="flex items-center gap-1"><FiMail className="w-3 h-3" /> {email}</span>}
                                    {(phone) && <span className="flex items-center gap-1"><FiPhone className="w-3 h-3" /> {phone}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-1">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/members')}
                                className="flex items-center gap-2 bg-white"
                            >
                                <FiArrowLeft /> Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <FiEdit /> Edit
                            </Button>
                            <span className={`px-3 py-1.5 ml-2 rounded-full text-sm font-semibold capitalize border ${membershipStatus === 'active' ? 'bg-green-50 text-green-700 border-green-100' :
                                membershipStatus === 'inactive' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-700 border-gray-100'
                                }`}>
                                {membershipStatus}
                            </span>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100">
                        <TabButton name="profile" label="Profile" icon={FiUser} />
                        <TabButton name="attendance" label="Attendance" icon={FiClock} />
                        <TabButton name="finance" label="Giving" icon={FiDollarSign} />
                        <TabButton name="groups" label="Groups" icon={FiUsers} />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Tab Content */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <Card title="Member Details" icon={<FiUser />}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                        <p className="text-gray-900 font-medium">{firstName} {lastName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                        <p className="text-gray-900 font-medium">{email || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                                        <p className="text-gray-900 font-medium">{phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</label>
                                        <p className="text-gray-900 font-medium flex items-center gap-2">
                                            <FiMapPin className="text-gray-400" />
                                            {address || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                                        <p className="text-gray-900 font-medium capitalize">{member.gender || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</label>
                                        <p className="text-gray-900 font-medium">
                                            {member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Marital Status</label>
                                        <p className="text-gray-900 font-medium capitalize">{member.marital_status || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Member Since</label>
                                        <p className="text-gray-900 font-medium">
                                            {membershipDate ? new Date(membershipDate).toLocaleDateString() : 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <UserAccountCard member={member} onUpdate={fetchMemberData} />
                        </>
                    )}

                    {activeTab === 'attendance' && (
                        <Card title="Attendance History" icon={<FiClock />}>
                            {attendance.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FiCalendar className="mx-auto text-3xl mb-2 opacity-20" />
                                    <p>No attendance records found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Service</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {attendance.map((record, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {new Date(record.service_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {record.service_name || record.service_type}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                                                            Present
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    )}

                    {activeTab === 'finance' && (
                        <Card title="Contribution History" icon={<FiDollarSign />}>
                            {contributions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FiDollarSign className="mx-auto text-3xl mb-2 opacity-20" />
                                    <p>No contributions recorded yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Method</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {contributions.map((contrib) => (
                                                <tr key={contrib.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {new Date(contrib.contribution_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                                                        {contrib.contribution_type}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">
                                                        {contrib.payment_method?.replace('_', ' ')}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                                                        KES {parseFloat(contrib.amount).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    )}

                    {activeTab === 'groups' && (
                        <Card title="Group Memberships" icon={<FiUsers />}>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                            Assign to Group
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            value={selectedGroupId}
                                            onChange={(e) => setSelectedGroupId(e.target.value)}
                                        >
                                            <option value="">Select a group...</option>
                                            {allGroups.map(group => (
                                                <option key={group.id} value={group.id}>{group.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button
                                        variant="primary"
                                        disabled={!selectedGroupId || assigningGroup}
                                        onClick={handleAssignGroup}
                                    >
                                        {assigningGroup ? 'Assigning...' : 'Assign Group'}
                                    </Button>
                                </div>

                                {memberGroups.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <FiUsers className="mx-auto text-3xl mb-2 opacity-20" />
                                        <p>Not a member of any groups.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Group Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Joined</th>
                                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {memberGroups.map((group) => (
                                                    <tr key={group.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {group.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
                                                            {group.description || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {group.joined_at ? new Date(group.joined_at).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm">
                                                            <button
                                                                onClick={() => handleRemoveGroup(group.id)}
                                                                className="text-red-600 hover:text-red-800 font-medium text-xs"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card title="Quick Stats" className="h-fit">
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="text-xs font-bold text-blue-600 uppercase mb-1">Total Given</div>
                                <div className="text-2xl font-bold text-blue-900">
                                    KES {contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0).toLocaleString()}
                                </div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="text-xs font-bold text-green-600 uppercase mb-1">Attendance Rate</div>
                                <div className="text-2xl font-bold text-green-900">
                                    {attendance.length > 0 ? '98%' : 'N/A'}
                                </div>
                                <div className="text-xs text-green-700 mt-1">
                                    {attendance.length} services attended
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Family" icon={<FiActivity />}>
                        <div className="text-center py-6 text-gray-400 text-sm">
                            No family members linked.
                            <button className="block mx-auto mt-2 text-primary font-semibold hover:underline">Link Family</button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Sub-component for User Account Management
const UserAccountCard = ({ member, onUpdate }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [email, setEmail] = useState(member.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member');

    // For reset
    const [newPassword, setNewPassword] = useState('');

    const hasLogin = !!member.user_id;

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.createMemberLogin(member.id, email, password, role);
            alert('Login created successfully');
            setIsCreating(false);
            onUpdate();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create login');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.adminResetPassword(member.user_id, newPassword);
            alert('Password reset successfully');
            setIsResetting(false);
            setNewPassword('');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="User Account" icon={<FiLock />}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${hasLogin ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="font-medium text-gray-900">
                            {hasLogin ? 'Active Account' : 'No Login Account'}
                        </span>
                    </div>
                    {hasLogin && (
                        <div className="mt-2 text-sm text-gray-500">
                            Role: <span className="capitalize font-semibold text-gray-700">{member.user_role}</span>
                        </div>
                    )}
                </div>

                <div>
                    {!hasLogin ? (
                        !isCreating ? (
                            <Button onClick={() => setIsCreating(true)}>Create Login</Button>
                        ) : null
                    ) : (
                        !isResetting ? (
                            <Button variant="outline" onClick={() => setIsResetting(true)}>Reset Password</Button>
                        ) : null
                    )}
                </div>
            </div>

            {/* Create Login Form */}
            {isCreating && (
                <form onSubmit={handleCreate} className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-800">Create New Login</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                                minLength={8}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min 8 chars"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Role</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="member">Member</option>
                                <option value="leader">Leader</option>
                                <option value="finance">Finance</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
                    </div>
                </form>
            )}

            {/* Reset Password Form */}
            {isResetting && (
                <form onSubmit={handleReset} className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-800">Reset Password</h3>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg"
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" type="button" onClick={() => setIsResetting(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">{loading ? 'Resetting...' : 'Reset Password'}</Button>
                    </div>
                </form>
            )}
        </Card>
    );
};

export default MemberDetail;
