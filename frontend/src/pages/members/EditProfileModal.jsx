import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import memberService from '../../services/memberService';

const EditProfileModal = ({ isOpen, onClose, onSaved, member }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phonenumber: '',
        address: '',
        date_of_birth: '',
        gender: '',
        marital_status: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (member) {
            setFormData({
                first_name: member.first_name || '',
                last_name: member.last_name || '',
                phone: member.phone || '',
                address: member.address || '',
                date_of_birth: member.date_of_birth ? member.date_of_birth.split('T')[0] : '',
                gender: member.gender || 'male',
                marital_status: member.marital_status || 'single'
            });
        }
    }, [member]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Only send editable fields
            const updateData = {
                firstName: formData.first_name,
                lastName: formData.last_name,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.date_of_birth,
                gender: formData.gender,
                maritalStatus: formData.marital_status
                // Note: We don't update familyId, status, membership_date here
            };

            await memberService.update(member.id, updateData);
            onSaved();
            onClose();
        } catch (err) {
            console.error('Update profile error:', err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <Input
                        label="Date of Birth"
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                        <select
                            name="marital_status"
                            value={formData.marital_status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditProfileModal;
