import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from './MemberDashboard';
import FinanceDashboard from './FinanceDashboard';
import LeaderDashboard from './LeaderDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import ChairmanDashboard from './ChairmanDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return null; // Or a loading spinner
    }

    const { role } = user;

    if (['sysadmin', 'admin'].includes(role)) {
        return <AdminDashboard />;
    }

    if (role === 'finance') {
        return <FinanceDashboard />;
    }

    if (role === 'leader') {
        return <LeaderDashboard />;
    }

    if (role === 'secretary') {
        return <SecretaryDashboard />;
    }

    if (role === 'chairman') {
        return <ChairmanDashboard />;
    }

    // Default to Member dashboard
    return <MemberDashboard />;
};

export default Dashboard;
