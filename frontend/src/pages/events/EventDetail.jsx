import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../../services/eventService';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                const [eventData, registrationData] = await Promise.all([
                    eventService.getById(id),
                    eventService.getRegistrations(id).catch(() => []) // Handle potential 404/403 gracefully
                ]);

                setEvent(eventData);
                setRegistrations(registrationData || []);
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError('Failed to load event data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventData();
        }
    }, [id]);

    if (loading) return <div className="p-6 text-center">Loading event details...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!event) return <div className="p-6">Event not found.</div>;

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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{event.event_name}</h1>
                    <p className="text-gray-600">
                        {new Date(event.start_date).toLocaleDateString()} • {event.location || 'No location'}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/events-management')}
                    className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-gray-700"
                >
                    Back to List
                </button>
            </div>

            <div className="flex space-x-2 border-b border-gray-200 mb-6">
                <TabButton name="overview" label="Overview" />
                <TabButton name="registrations" label="Registrations" />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'overview' && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Event Information</h3>
                        <p className="mb-2"><span className="font-medium">Description:</span> {event.description || 'No description provided.'}</p>
                        <p className="mb-2"><span className="font-medium">Type:</span> {event.event_type}</p>
                        <p className="mb-2"><span className="font-medium">Cost:</span> ${event.cost || '0.00'}</p>
                        <p className="mb-2"><span className="font-medium">Status:</span> {event.is_public ? 'Public' : 'Private'}</p>
                    </div>
                )}

                {activeTab === 'registrations' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Registered Attendees ({registrations.length})</h3>
                        </div>
                        {registrations.length === 0 ? (
                            <p className="text-gray-500 italic">No registrations found.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {registrations.map((reg) => (
                                        <tr key={reg.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {reg.member_name || 'Unknown Member'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${reg.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {reg.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {reg.registration_date ? new Date(reg.registration_date).toLocaleDateString() : 'N/A'}
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

export default EventDetail;
