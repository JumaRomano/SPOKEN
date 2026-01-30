import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import memberService from '../../services/memberService';
import { FiUser, FiCalendar, FiDollarSign, FiClock, FiMail, FiPhone, FiMapPin, FiEdit } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import EditProfileModal from './EditProfileModal';

const MemberProfile = () => {
    const { user } = useAuth();
    const [member, setMember] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [memberGroups, setMemberGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchMemberData = async () => {
        try {
            setLoading(true);
            const [memberData, attendanceData, contributionData, groupData] = await Promise.all([
                memberService.getById(user.memberId),
                memberService.getAttendance(user.memberId).catch(() => []),
                memberService.getContributions(user.memberId).catch(() => ({ contributions: [] })),
                memberService.getGroups(user.memberId).catch(() => [])
            ]);

            setMember(memberData);
            setAttendance(attendanceData || []);
            setContributions(contributionData?.contributions || []);
            setMemberGroups(groupData || []);
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.memberId) {
            fetchMemberData();
        }
    }, [user]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500">Loading your profile...</p>
        </div>
    );

    if (!member) return <div className="p-6 text-center">Profile not found.</div>;

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
        <div className="max-w-5xl mx-auto pb-12 space-y-6">
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSaved={fetchMemberData}
                member={member}
            />

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-secondary-dark relative">
                    <div className="absolute inset-0 bg-primary opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden">
                                    {member.profile_photo_url ? (
                                        <img src={member.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{member.first_name?.charAt(0)}{member.last_name?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="mb-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {member.first_name} {member.last_name}
                                </h1>
                                <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
                                    {member.email && <span className="flex items-center gap-1"><FiMail className="w-3 h-3" /> {member.email}</span>}
                                    {member.phone && <span className="flex items-center gap-1"><FiPhone className="w-3 h-3" /> {member.phone}</span>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                variant="primary"
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <FiEdit /> Edit Profile
                            </Button>
                        </div>
                    </div>

                    <div className="flex border-b border-gray-100">
                        <TabButton name="profile" label="Personal Details" icon={FiUser} />
                        <TabButton name="attendance" label="My Attendance" icon={FiClock} />
                        <TabButton name="finance" label="Giving History" icon={FiDollarSign} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'profile' && (
                    <Card title="Personal Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                <p className="text-gray-900 font-medium">{member.first_name} {member.last_name}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                                <p className="text-gray-900 font-medium">{member.email}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                                <p className="text-gray-900 font-medium">{member.phone || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <FiMapPin className="text-gray-400" />
                                    {member.address || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</label>
                                <p className="text-gray-900 font-medium">
                                    {member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : '-'}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {activeTab === 'attendance' && (
                    <Card title="Attendance Record">
                        {attendance.length === 0 ? (
                            <p className="text-gray-500 text-center py-6">No attendance records found.</p>
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
                                                <td className="px-4 py-3 text-sm text-gray-900">{new Date(record.service_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{record.service_name || record.service_type}</td>
                                                <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full">Present</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                )}

                {activeTab === 'finance' && (
                    <Card title="Giving History">
                        {contributions.length === 0 ? (
                            <p className="text-gray-500 text-center py-6">No contributions found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {contributions.map((c, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{new Date(c.contribution_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 capitalize">{c.contribution_type}</td>
                                                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">KES {parseFloat(c.amount).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default MemberProfile;
