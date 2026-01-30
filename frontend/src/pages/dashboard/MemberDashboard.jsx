import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import memberService from '../../services/memberService';
import Card from '../../components/common/Card';
import {
    FiCalendar, FiActivity, FiArrowRight, FiHeart, FiClock, FiUsers
} from 'react-icons/fi';
import { BiGroup } from 'react-icons/bi';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [memberData, setMemberData] = useState(null);
    const [memberStats, setMemberStats] = useState({
        contributions: 0,
        attendance: 0,
        groups: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberDashboardData = async () => {
            if (!user?.memberId) {
                setLoading(false);
                return;
            }
            try {
                // Fetch Member Data
                const [mDetails, mContribs, mAttendance, mGroups] = await Promise.all([
                    memberService.getById(user.memberId),
                    memberService.getContributions(user.memberId),
                    memberService.getAttendance(user.memberId),
                    memberService.getGroups(user.memberId)
                ]);

                setMemberData(mDetails);
                setMemberStats({
                    contributions: mContribs?.total || 0,
                    attendance: mAttendance?.length || 0,
                    groups: mGroups?.length || 0
                });
            } catch (err) {
                console.error("Failed to fetch member dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Member Portal</span>
                    <h1 className="text-3xl font-bold text-secondary-dark mt-1">
                        Welcome back, {memberData?.first_name || user?.email?.split('@')[0]}
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Here's an overview of your activity and upcoming events.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                    <FiCalendar className="text-primary" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Member Stats */}
            {/* Member Stats - Bento Grid Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Total Giving</p>
                            <h3 className="text-3xl font-bold text-secondary-dark tracking-tight">KES {memberStats.contributions.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <FiHeart className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-1 rounded">Faithful Giver</span>
                        <Link to={`/members/${user.memberId}`} className="text-sm font-medium text-secondary hover:text-primary flex items-center gap-1">
                            View History <FiArrowRight />
                        </Link>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">Services Attended</p>
                            <h3 className="text-3xl font-bold text-secondary-dark tracking-tight">{memberStats.attendance}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <FiClock className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Active Member</span>
                        <Link to="/attendance" className="text-sm font-medium text-secondary hover:text-emerald-600 flex items-center gap-1">
                            View Record <FiArrowRight />
                        </Link>
                    </div>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 group">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">My Groups</p>
                            <h3 className="text-3xl font-bold text-secondary-dark tracking-tight">{memberStats.groups}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <BiGroup className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">Connected</span>
                        <Link to="/groups" className="text-sm font-medium text-secondary hover:text-purple-600 flex items-center gap-1">
                            Browse Groups <FiArrowRight />
                        </Link>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Quick Actions">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/events" className="group p-5 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiCalendar className="text-xl" />
                                </div>
                                <div>
                                    <span className="block font-bold text-secondary-dark">Browse Events</span>
                                    <span className="text-sm text-slate-500">Register for upcoming services</span>
                                </div>
                                <FiArrowRight className="ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                            </Link>

                            <Link to="/sermons" className="group p-5 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiActivity className="text-xl" />
                                </div>
                                <div>
                                    <span className="block font-bold text-secondary-dark">Watch Sermons</span>
                                    <span className="text-sm text-slate-500">Catch up on recent teachings</span>
                                </div>
                                <FiArrowRight className="ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                            </Link>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Profile Card Removed as per request */}
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
