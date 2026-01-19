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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {memberData?.first_name || user?.email?.split('@')[0]}!
                    </h1>
                    <p className="text-gray-500 mt-1">Here is what's happening in your church life.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <FiCalendar />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Member Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <FiHeart className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm font-medium">My Giving (Total)</p>
                            <h3 className="text-3xl font-bold">KES {memberStats.contributions.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <Link to={`/members/${user.memberId}`} className="text-sm font-medium flex items-center gap-2 hover:underline">
                            View History <FiArrowRight />
                        </Link>
                    </div>
                </Card>

                <Card className="bg-white border-green-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <FiClock className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Services Attended</p>
                            <h3 className="text-3xl font-bold text-gray-900">{memberStats.attendance}</h3>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">Keep it up!</span>
                    </div>
                </Card>

                <Card className="bg-white border-purple-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                            <BiGroup className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">My Groups</p>
                            <h3 className="text-3xl font-bold text-gray-900">{memberStats.groups}</h3>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <Link to={`/members/${user.memberId}`} className="text-sm text-purple-600 font-medium hover:underline">View Groups</Link>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Quick Actions">
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/events" className="p-4 border rounded-xl hover:bg-gray-50 transition-colors flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <FiCalendar className="text-xl" />
                                </div>
                                <span className="font-semibold text-gray-700">Browse Events</span>
                            </Link>
                            <Link to="/sermons" className="p-4 border rounded-xl hover:bg-gray-50 transition-colors flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <FiActivity className="text-xl" />
                                </div>
                                <span className="font-semibold text-gray-700">Watch Sermons</span>
                            </Link>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">My Profile</h3>
                            <p className="text-white/80 text-sm mb-4">Update your personal information and contact details.</p>
                            <Link to={`/members/${user.memberId}`} className="inline-block bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                                Edit Profile
                            </Link>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
