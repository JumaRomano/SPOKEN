import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import memberService from '../../services/memberService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CreateMemberModal from './CreateMemberModal';
import './MemberList.css';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, [search, pagination.offset]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const params = {
                limit: pagination.limit,
                offset: pagination.offset,
                search,
                status: 'active',
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
        <div className="member-list-container">
            <CreateMemberModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onMemberCreated={fetchMembers}
            />
            <Card
                title="Members Directory"
                subtitle={`${pagination.total} total members`}
                actions={
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>Add Member</Button>
                }
            >
                <div className="search-box">
                    <input
                        type="search"
                        placeholder="Search members by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>

                {loading ? (
                    <div className="loading-state">Loading members...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : members.length === 0 ? (
                    <div className="empty-state">No members found</div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="members-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Member Since</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="member-name">
                                                {member.firstName} {member.lastName}
                                            </td>
                                            <td>{member.email || '-'}</td>
                                            <td>{member.phone || '-'}</td>
                                            <td>
                                                <span className={`status-badge status-${member.membershipStatus}`}>
                                                    {member.membershipStatus}
                                                </span>
                                            </td>
                                            <td>
                                                {member.membershipDate
                                                    ? new Date(member.membershipDate).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td>
                                                <Link to={`/members/${member.id}`}>
                                                    <Button variant="secondary" size="small">
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <Button
                                variant="secondary"
                                onClick={handlePrevPage}
                                disabled={pagination.offset === 0}
                            >
                                Previous
                            </Button>
                            <span className="pagination-info">
                                Showing {pagination.offset + 1} to{' '}
                                {Math.min(pagination.offset + pagination.limit, pagination.total)} of{' '}
                                {pagination.total}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={handleNextPage}
                                disabled={pagination.offset + pagination.limit >= pagination.total}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default MemberList;
