import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === 'tutor') {
      return <Navigate to="/tutor-dashboard" />;
    } else {
      return <Navigate to="/parent-dashboard" />;
    }
  }
  
  return children;
};

export default ProtectedRoute;