import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import memberService from '../../services/memberService';

const MemberDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                setLoading(true);
                const [memberData, attendanceData, contributionData] = await Promise.all([
                    memberService.getById(id),
                    memberService.getAttendance(id),
                    memberService.getContributions(id)
                ]);

                setMember(memberData);
                setAttendance(attendanceData || []);
                setContributions(contributionData || []);
            } catch (err) {
                console.error('Error fetching member details:', err);
                setError('Failed to load member data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMemberData();
        }
    }, [id]);

    if (loading) return <div className="p-6 text-center">Loading member details...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!member) return <div className="p-6">Member not found.</div>;

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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {member.first_name} {member.last_name}
                    </h1>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${member.membership_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {member.membership_status?.toUpperCase()}
                    </span>
                </div>
                <button
                    onClick={() => navigate('/members')}
                    className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-gray-700"
                >
                    Back to List
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 mb-6">
                <TabButton name="profile" label="Profile Info" />
                <TabButton name="attendance" label="Attendance History" />
                <TabButton name="finance" label="Giving Records" />
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
                            <div className="space-y-3">
                                <p><span className="font-medium text-gray-600">Email:</span> {member.email || 'N/A'}</p>
                                <p><span className="font-medium text-gray-600">Phone:</span> {member.phone || 'N/A'}</p>
                                <p><span className="font-medium text-gray-600">Address:</span> {member.address || 'N/A'}</p>
                                <p><span className="font-medium text-gray-600">Gender:</span> {member.gender || 'N/A'}</p>
                                <p><span className="font-medium text-gray-600">Date of Birth:</span> {member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                                <p><span className="font-medium text-gray-600">Marital Status:</span> {member.marital_status || 'N/A'}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Church Information</h3>
                            <div className="space-y-3">
                                <p><span className="font-medium text-gray-600">Membership Date:</span> {member.membership_date ? new Date(member.membership_date).toLocaleDateString() : 'N/A'}</p>
                                <p><span className="font-medium text-gray-600">Baptism Date:</span> {member.baptism_date ? new Date(member.baptism_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Attendance</h3>
                        {attendance.length === 0 ? (
                            <p className="text-gray-500 italic">No attendance records found.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendance.map((record) => (
                                        <tr key={record.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(record.service_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.service_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${record.attribute === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {record.attendance_status || 'Present'}
                                                </span>
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
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Contribution History</h3>
                        {contributions.length === 0 ? (
                            <p className="text-gray-500 italic">No contributions recorded.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {contributions.map((contrib) => (
                                        <tr key={contrib.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(contrib.contribution_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {contrib.contribution_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ${parseFloat(contrib.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {contrib.payment_method}
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

export default MemberDetail;
