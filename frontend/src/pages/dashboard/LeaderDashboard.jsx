import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import memberService from '../../services/memberService';
import {
    FiUsers, FiCalendar, FiActivity, FiArrowRight, FiCheckSquare, FiMessageSquare, FiPlus
} from 'react-icons/fi';
import { BiGroup } from 'react-icons/bi';

const LeaderDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalGroups: 0,
        upcomingEvents: 0,
        myGroups: 0
    });
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [globalStats, myGroups] = await Promise.all([
                    dashboardService.getStats(),
                    // If the user has a linked memberId, fetch their groups
                    user?.memberId ? memberService.getGroups(user.memberId).catch(() => []) : []
                ]);

                setStats({
                    ...globalStats,
                    myGroups: myGroups.length
                });
                setGroups(myGroups);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leader Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your groups and people</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/groups/create" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                        <BiGroup />
                        New Group
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <BiGroup className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">My Groups</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.myGroups || stats.totalGroups}</h3>
                        </div>
                    </div>
                    <Link to="/groups" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                        View Details <FiArrowRight />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <FiCalendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Upcoming Events</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</h3>
                        </div>
                    </div>
                    <Link to="/events" className="text-orange-600 text-sm font-medium hover:underline flex items-center gap-1">
                        Manage Calendar <FiArrowRight />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Your Groups</h3>
                    <div className="space-y-4">
                        {groups.length > 0 ? (
                            groups.map(group => (
                                <div key={group.id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                            {group.name ? group.name.substring(0, 2).toUpperCase() : 'G'}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{group.name}</div>
                                            <div className="text-xs text-gray-500">{group.description || 'No description'}</div>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 px-4">
                                <div className="p-3 bg-gray-50 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                                    <BiGroup className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-gray-900 font-medium mb-1">No groups led yet</p>
                                <p className="text-sm text-gray-500 mb-6">Create your first group to start managing members.</p>
                                <Link
                                    to="/groups/create"
                                    className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                                >
                                    <FiPlus />
                                    Create Group
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderDashboard;
