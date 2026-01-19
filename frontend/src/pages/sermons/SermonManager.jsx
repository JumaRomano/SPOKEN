import React, { useState, useEffect } from 'react';
import sermonService from '../../services/sermonService';
import Button from '../../components/common/Button';

const SermonManager = () => {
    const [sermons, setSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        video_url: '',
        speaker: '',
        series: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchSermons = async () => {
        try {
            const data = await sermonService.getAll();
            setSermons(data);
        } catch (error) {
            console.error('Failed to fetch sermons', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSermons();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sermonService.create(formData);
            setShowForm(false);
            setFormData({
                title: '',
                video_url: '',
                speaker: '',
                series: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            fetchSermons();
        } catch (error) {
            console.error('Failed to create sermon', error);
            alert('Failed to create sermon');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sermon?')) {
            try {
                await sermonService.delete(id);
                fetchSermons();
            } catch (error) {
                console.error('Failed to delete sermon', error);
                alert('Failed to delete sermon');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sermon Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                >
                    {showForm ? 'Cancel' : 'Add New Sermon'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Add New Sermon</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                                <input
                                    type="text"
                                    name="speaker"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    value={formData.speaker}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                                <input
                                    type="text"
                                    name="series"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    value={formData.series}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok Video URL</label>
                                <input
                                    type="url"
                                    name="video_url"
                                    required
                                    placeholder="https://www.tiktok.com/@user/video/..."
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    value={formData.video_url}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-500 mt-1">Paste the full link to the TikTok video.</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                            >
                                Save Sermon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speaker</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Series</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : sermons.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No sermons found. Add one above.</td></tr>
                        ) : (
                            sermons.map((sermon) => (
                                <tr key={sermon.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(sermon.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{sermon.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{sermon.video_url}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sermon.speaker}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sermon.series}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(sermon.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SermonManager;
