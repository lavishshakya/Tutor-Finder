<<<<<<< HEAD
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
=======
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/home";
import AboutUs from "./pages/about";
import Tutor from "./pages/tutor";
import TutorProfile from "./pages/TutorProfile"; // Import the new component
import ParentDashboard from "./pages/ParentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import TutorProfileSetup from "./pages/TutorProfileSetupNew";
import EditTutorProfile from "./pages/EditTutorProfile";
import EditParentProfile from "./pages/EditParentProfile";
import AIAssistant from "./pages/AIAssistant";
import PaymentPage from "./pages/PaymentPage";
import AuthCallback from "./pages/AuthCallback";
import OAuthComplete from "./pages/OAuthComplete";
>>>>>>> 181f83f (Updated Features)

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
<<<<<<< HEAD
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
        
=======
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/oauth-complete" element={<OAuthComplete />} />
        <Route path="/tutor-profile/:id" element={<TutorProfile />} />{" "}
        {/* Add new route for tutor profile */}
        {/* Protected routes */}
        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-profile-setup"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <TutorProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-tutor-profile"
          element={
            <ProtectedRoute allowedRoles={["tutor"]}>
              <EditTutorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-parent-profile"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <EditParentProfile />
            </ProtectedRoute>
          }
        />
>>>>>>> 181f83f (Updated Features)
        <Route path="/" element={<Home />} />
      </Routes>
    </AuthProvider>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 181f83f (Updated Features)
