import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/navbar';
import Login from './pages/login';
import Signup from './pages/Signup';
import Home from './pages/home';
import AboutUs from './pages/about';  
import Tutor from './pages/tutor';
import TutorProfile from './pages/TutorProfile'; // Import the new component
import ParentDashboard from './pages/ParentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import TutorProfileSetup from './pages/TutorProfileSetup';
import EditTutorProfile from './pages/EditTutorProfile';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/tutors" element={<Tutor />} />
        <Route path="/tutor-profile/:id" element={<TutorProfile />} /> {/* Add new route for tutor profile */}
        
        {/* Protected routes */}
        <Route 
          path="/parent-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tutor-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tutor-profile-setup" 
          element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorProfileSetup />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/edit-tutor-profile" 
          element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <EditTutorProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;