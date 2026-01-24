import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleProtectedRoute - Protects routes based on user roles
 * Redirects unauthorized users to dashboard
 */
const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // Check if user's role is in the allowed roles list
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
