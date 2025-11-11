<<<<<<< HEAD
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
=======
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === "tutor") {
>>>>>>> 181f83f (Updated Features)
      return <Navigate to="/tutor-dashboard" />;
    } else {
      return <Navigate to="/parent-dashboard" />;
    }
  }
<<<<<<< HEAD
  
  return children;
};

export default ProtectedRoute;
=======

  return children;
};

export default ProtectedRoute;
>>>>>>> 181f83f (Updated Features)
