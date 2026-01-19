import { useState, useEffect } from 'react';
import attendanceService from '../../services/attendanceService';
import memberService from '../../services/memberService';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';

const AttendanceRecorder = () => {
    const [services, setServices] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [recordingMode, setRecordingMode] = useState('bulk'); // 'single' or 'bulk'
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [singleAttendance, setSingleAttendance] = useState({
        memberId: '',
        status: 'present',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchServices();
        fetchMembers();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await attendanceService.getServices({ limit: 50 });
            setServices(data);
        } catch (err) {
            console.error('Error fetching services:', err);
        }
    };

    const fetchMembers = async () => {
        try {
            const data = await memberService.getAll({ limit: 500 });
            setMembers(data.members || data);
        } catch (err) {
            console.error('Error fetching members:', err);
        }
    };

    const handleBulkToggle = (memberId) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSelectAll = () => {
        if (selectedMembers.length === members.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(members.map(m => m.id));
        }
    };

    const handleSingleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedService) {
            setMessage({ type: 'error', text: 'Please select a service' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await attendanceService.recordAttendance(selectedService, singleAttendance);
            setMessage({ type: 'success', text: 'Attendance recorded successfully!' });
            setSingleAttendance({ memberId: '', status: 'present', notes: '' });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to record attendance'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBulkSubmit = async () => {
        if (!selectedService) {
            setMessage({ type: 'error', text: 'Please select a service' });
            return;
        }

        if (selectedMembers.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one member' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await attendanceService.bulkRecordAttendance(selectedService, selectedMembers);
            setMessage({
                type: 'success',
                text: `Attendance recorded for ${selectedMembers.length} members!`
            });
            setSelectedMembers([]);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to record bulk attendance'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {message.text && (
                <div
                    className={`px-4 py-3 rounded ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <Card title="Record Attendance">
                <div className="space-y-4">
                    <Select
                        label="Select Service"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        options={[
                            { value: '', label: 'Choose a service...' },
                            ...services.map(s => ({
                                value: s.id,
                                label: `${new Date(s.service_date).toLocaleDateString()} - ${s.service_type.replace('_', ' ').toUpperCase()}`
                            }))
                        ]}
                        required
                    />

                    <div className="flex gap-4 border-b pb-4">
                        <button
                            type="button"
                            onClick={() => setRecordingMode('bulk')}
                            className={`px-4 py-2 rounded ${recordingMode === 'bulk'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Bulk Recording
                        </button>
                        <button
                            type="button"
                            onClick={() => setRecordingMode('single')}
                            className={`px-4 py-2 rounded ${recordingMode === 'single'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Single Member
                        </button>
                    </div>

                    {recordingMode === 'bulk' ? (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-gray-700">
                                    Select Members ({selectedMembers.length} selected)
                                </h3>
                                <Button
                                    variant="secondary"
                                    onClick={handleSelectAll}
                                    size="sm"
                                >
                                    {selectedMembers.length === members.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </div>

                            <div className="max-h-96 overflow-y-auto border rounded p-4">
                                {members.map(member => (
                                    <label
                                        key={member.id}
                                        className="flex items-center gap-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(member.id)}
                                            onChange={() => handleBulkToggle(member.id)}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <span className="text-gray-700">
                                            {member.first_name} {member.last_name}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-4">
                                <Button
                                    variant="primary"
                                    onClick={handleBulkSubmit}
                                    disabled={loading || !selectedService || selectedMembers.length === 0}
                                    fullWidth
                                >
                                    {loading ? 'Recording...' : 'Record Attendance'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSingleSubmit} className="space-y-4">
                            <Select
                                label="Member"
                                value={singleAttendance.memberId}
                                onChange={(e) =>
                                    setSingleAttendance(prev => ({ ...prev, memberId: e.target.value }))
                                }
                                options={[
                                    { value: '', label: 'Select a member...' },
                                    ...members.map(m => ({
                                        value: m.id,
                                        label: `${m.first_name} ${m.last_name}`
                                    }))
                                ]}
                                required
                            />

                            <Select
                                label="Status"
                                value={singleAttendance.status}
                                onChange={(e) =>
                                    setSingleAttendance(prev => ({ ...prev, status: e.target.value }))
                                }
                                options={[
                                    { value: 'present', label: 'Present' },
                                    { value: 'absent', label: 'Absent' },
                                    { value: 'excused', label: 'Excused' },
                                ]}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={singleAttendance.notes}
                                    onChange={(e) =>
                                        setSingleAttendance(prev => ({ ...prev, notes: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Additional notes..."
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading || !selectedService}
                                fullWidth
                            >
                                {loading ? 'Recording...' : 'Record Attendance'}
                            </Button>
                        </form>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AttendanceRecorder;
