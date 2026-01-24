import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

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

RoleProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleProtectedRoute;
