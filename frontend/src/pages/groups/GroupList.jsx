import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiClipboard, FiBriefcase, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import groupService from '../../services/groupService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CreateGroupModal from './CreateGroupModal';
import './GroupList.css';

const GroupList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await groupService.getAll();

            // Ensure we always have an array
            if (response && Array.isArray(response.groups)) {
                setGroups(response.groups);
            } else if (response && typeof response === 'object') {
                setGroups(response.groups || []);
            } else {
                console.error('Unexpected response format:', response);
                setGroups([]);
            }
        } catch (err) {
            setError('Failed to load groups');
            console.error('Error fetching groups:', err);
            setGroups([]); // Ensure groups is always an array
        } finally {
            setLoading(false);
        }
    };

    const groupTypes = {
        ministry: { icon: FiHome, color: '#667eea' },
        fellowship: { icon: FiUsers, color: '#48bb78' },
        committee: { icon: FiClipboard, color: '#ed8936' },
        department: { icon: FiBriefcase, color: '#9f7aea' },
    };

    const canCreateGroup = ['admin', 'sysadmin', 'leader'].includes(user?.role);

    return (
        <div className="group-list-container">
            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onGroupCreated={fetchGroups}
            />
            <Card
                title="Groups & Ministries"
                subtitle={`${groups.length} active groups`}
                actions={canCreateGroup && <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>Create Group</Button>}
            >
                {loading ? (
                    <div className="loading-state">Loading groups...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : groups.length === 0 ? (
                    <div className="empty-state">No groups found</div>
                ) : (
                    <div className="groups-grid">
                        {groups.map((group) => {
                            const typeInfo = groupTypes[group.group_type] || groupTypes.ministry;
                            return (
                                <div key={group.id} className="group-card">
                                    <div
                                        className="group-icon"
                                        style={{ backgroundColor: `${typeInfo.color}20`, color: typeInfo.color }}
                                    >
                                        <typeInfo.icon size={24} />
                                    </div>
                                    <div className="group-info">
                                        <h3 className="group-name">{group.name}</h3>
                                        <p className="group-description">
                                            {group.description || 'No description'}
                                        </p>
                                        <div className="group-meta">
                                            <span className="group-type capitalize">{group.group_type}</span>
                                            <span className="group-members">
                                                {group.member_count || 0} members
                                            </span>
                                        </div>
                                        {group.meeting_schedule && (
                                            <div className="group-schedule">
                                                <FiCalendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                {group.meeting_schedule}
                                            </div>
                                        )}
                                    </div>
                                    <div className="group-actions">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => navigate(`/groups/${group.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default GroupList;
