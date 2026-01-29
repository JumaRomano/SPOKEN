import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import memberService from '../../services/memberService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CreateMemberModal from './CreateMemberModal';
import { FiSearch, FiPlus, FiMoreVertical, FiUser, FiMail, FiPhone, FiCalendar, FiChevronLeft, FiChevronRight, FiUsers } from 'react-icons/fi';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
    const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, [search, pagination.offset, statusFilter]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const params = {
                limit: pagination.limit,
                offset: pagination.offset,
                search,
                status: statusFilter === 'all' ? undefined : statusFilter,
            };
            const response = await memberService.getAll(params);
            setMembers(response.members || []);
            setPagination(prev => ({ ...prev, total: response.total || 0 }));
        } catch (err) {
            setError('Failed to load members');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (pagination.offset + pagination.limit < pagination.total) {
            setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
        }
    };

    const handlePrevPage = () => {
        if (pagination.offset > 0) {
            setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <CreateMemberModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onMemberSaved={fetchMembers}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Members Directory</h1>
                    <p className="text-gray-500 mt-1">Manage all church members and their details</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 shadow-lg shadow-primary/30"
                >
                    <FiPlus /> Add Member
                </Button>
            </div>

            <Card className="overflow-hidden border border-gray-100 shadow-sm">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FiSearch />
                        </div>
                        <input
                            type="search"
                            placeholder="Search members by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        Total Members: <span className="text-gray-900 font-bold">{pagination.total}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                        <p>Loading members...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50 m-6 rounded-xl border border-red-100">
                        <p className="font-semibold">{error}</p>
                        <Button variant="outline" size="small" className="mt-4" onClick={fetchMembers}>Retry</Button>
                    </div>
                ) : members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FiUsers className="text-3xl text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Members Found</h3>
                        <p className="max-w-xs text-center mb-6">Get started by adding your first member to the system.</p>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Add New Member</Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Member Since</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-primary-light/10 flex items-center justify-center text-primary font-bold">
                                                            {(member.firstName || member.first_name || '').charAt(0)}
                                                            {(member.lastName || member.last_name || '').charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {member.firstName || member.first_name} {member.lastName || member.last_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 capitalize">
                                                            {member.gender}, {member.maritalStatus || member.marital_status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                                        <FiMail className="w-3 h-3" /> {member.email || '-'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                                        <FiPhone className="w-3 h-3" /> {member.phone || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                                                    ${(member.membershipStatus || member.membership_status) === 'active' ? 'bg-green-100 text-green-800' :
                                                        (member.membershipStatus || member.membership_status) === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {member.membershipStatus || member.membership_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="w-3 h-3" />
                                                    {(member.membershipDate || member.membership_date)
                                                        ? new Date(member.membershipDate || member.membership_date).toLocaleDateString()
                                                        : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/members/${member.id}`} className="text-primary hover:text-primary-dark font-semibold hover:underline">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{pagination.offset + 1}</span> to <span className="font-medium">{Math.min(pagination.offset + pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={pagination.offset === 0}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.offset === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={pagination.offset + pagination.limit >= pagination.total}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.offset + pagination.limit >= pagination.total ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default MemberList;
