import { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import memberService from '../../services/memberService';
import groupService from '../../services/groupService';

const MemberModal = ({ isOpen, onClose, onMemberSaved, member = null }) => {
    const isEditMode = !!member;
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'male',
        maritalStatus: 'single',
        membershipStatus: 'active',
        address: '',
        dateOfBirth: ''
    });
    const [groupAssignment, setGroupAssignment] = useState({
        groupId: '',
        role: 'member'
    });
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await groupService.getAll();
                setGroups(res.groups || []);
            } catch (err) {
                console.error("Failed to fetch groups", err);
                setGroups([]); // Fallback to empty array on error
            }
        };
        if (isOpen) {
            fetchGroups();
        }
    }, [isOpen]);

    useEffect(() => {
        if (member) {
            setFormData({
                firstName: member.first_name || member.firstName || '',
                lastName: member.last_name || member.lastName || '',
                email: member.email || '',
                phone: member.phone || '',
                gender: member.gender || 'male',
                maritalStatus: member.marital_status || member.maritalStatus || 'single',
                membershipStatus: member.membership_status || member.membershipStatus || 'active',
                address: member.address || '',
                dateOfBirth: member.date_of_birth ? new Date(member.date_of_birth).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                gender: 'male',
                maritalStatus: 'single',
                membershipStatus: 'active',
                address: '',
                dateOfBirth: ''
            });
            setGroupAssignment({ groupId: '', role: 'member' });
        }
    }, [member, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setGroupAssignment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let savedMember;
            if (isEditMode) {
                savedMember = await memberService.update(member.id, formData);
            } else {
                savedMember = await memberService.create(formData);

                // Assign to group if selected (only in create mode)
                if (groupAssignment.groupId && savedMember && savedMember.id) {
                    await groupService.addMember(
                        groupAssignment.groupId,
                        savedMember.id,
                        groupAssignment.role
                    ).catch(err => console.error("Failed to assign group", err));
                }
            }
            onMemberSaved();
            onClose();
            if (!isEditMode) {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    gender: 'male',
                    maritalStatus: 'single',
                    membershipStatus: 'active',
                    address: '',
                    dateOfBirth: ''
                });
                setGroupAssignment({ groupId: '', role: 'member' });
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} member`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Member Details" : "Add New Member"}
            size="large"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+254..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' }
                        ]}
                    />
                    <Select
                        label="Marital Status"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        options={[
                            { value: 'single', label: 'Single' },
                            { value: 'married', label: 'Married' },
                            { value: 'divorced', label: 'Divorced' },
                            { value: 'widowed', label: 'Widowed' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Membership Status"
                        name="membershipStatus"
                        value={formData.membershipStatus}
                        onChange={handleChange}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                            { value: 'deceased', label: 'Deceased' }
                        ]}
                    />
                    <Input
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>

                <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Residential address"
                />

                {!isEditMode && (
                    <div className="pt-4 border-t border-gray-100 mt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Initial Group Assignment (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                                <select
                                    name="groupId"
                                    value={groupAssignment.groupId}
                                    onChange={handleGroupChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">None</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    name="role"
                                    value={groupAssignment.role}
                                    onChange={handleGroupChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    disabled={!groupAssignment.groupId}
                                >
                                    <option value="member">Member</option>
                                    <option value="leader">Leader</option>
                                    <option value="treasurer">Treasurer</option>
                                    <option value="secretary">Secretary</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Member')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MemberModal;
