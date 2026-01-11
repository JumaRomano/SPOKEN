import { useState, useEffect } from 'react';
import groupService from '../../services/groupService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import CreateGroupModal from './CreateGroupModal';
import './GroupList.css';

const GroupList = () => {
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
            const response = await groupService.getAll();
            setGroups(response.data || []);
        } catch (err) {
            setError('Failed to load groups');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const groupTypes = {
        ministry: { icon: '⛪', color: '#667eea' },
        fellowship: { icon: '🤝', color: '#48bb78' },
        committee: { icon: '📋', color: '#ed8936' },
        department: { icon: '🏢', color: '#9f7aea' },
    };

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
                actions={<Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>Create Group</Button>}
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
                            const typeInfo = groupTypes[group.groupType] || groupTypes.ministry;
                            return (
                                <div key={group.id} className="group-card">
                                    <div
                                        className="group-icon"
                                        style={{ backgroundColor: `${typeInfo.color}20` }}
                                    >
                                        {typeInfo.icon}
                                    </div>
                                    <div className="group-info">
                                        <h3 className="group-name">{group.name}</h3>
                                        <p className="group-description">
                                            {group.description || 'No description'}
                                        </p>
                                        <div className="group-meta">
                                            <span className="group-type">{group.groupType}</span>
                                            <span className="group-members">
                                                {group.memberCount || 0} members
                                            </span>
                                        </div>
                                        {group.meetingSchedule && (
                                            <div className="group-schedule">
                                                📅 {group.meetingSchedule}
                                            </div>
                                        )}
                                    </div>
                                    <div className="group-actions">
                                        <Button variant="secondary" size="small">
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
