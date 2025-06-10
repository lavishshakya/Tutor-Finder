import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import RatingForm from '../components/RatingForm';
import ChatInterface from '../components/ChatInterface';
import { FaComments, FaHeart, FaStar, FaTimes } from 'react-icons/fa';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [activeChatTutor, setActiveChatTutor] = useState(null);
  const [favoriteTutors, setFavoriteTutors] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [removingFavorite, setRemovingFavorite] = useState(null);

  useEffect(() => {
    // Security check
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Fetch favorite tutors
    const fetchFavoriteTutors = async () => {
      try {
        setLoadingFavorites(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Authentication token not found');
          setLoadingFavorites(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5001/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setFavoriteTutors(response.data.data);
        } else {
          console.error('Failed to load favorites');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorite tutors:', error);
        setLoading(false);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavoriteTutors();
    
    // Fetch tutors for ratings
    const fetchTutorsForParent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5001/api/parents/my-tutors',
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        if (response.data.success) {
          setTutors(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching tutors:', err);
      }
    };
    
    fetchTutorsForParent();
  }, [currentUser, navigate]);

  const handleStartChat = (tutor) => {
    setActiveChatTutor(tutor);
    setShowChatInterface(true);
  };

  const handleRemoveFavorite = async (tutorId) => {
    try {
      setRemovingFavorite(tutorId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axios.delete(
        `http://localhost:5001/api/favorites/${tutorId}`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // Update state to remove the tutor from favorites
        setFavoriteTutors(prev => prev.filter(tutor => tutor._id !== tutorId));
      } else {
        throw new Error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing tutor from favorites:', error);
      alert('Failed to remove tutor from favorites. Please try again.');
    } finally {
      setRemovingFavorite(null);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="animate-pulse text-indigo-600 font-medium">
          <svg className="w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
          <button 
            onClick={logout}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center">
            <div className="hidden sm:block mr-6">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {currentUser?.name}!</h2>
              <p className="opacity-90 mt-1">Find and connect with the best tutors for your educational needs</p>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Favorite Tutors</h3>
                <p className="text-xl font-bold text-gray-800">{favoriteTutors.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Find New Tutors</h3>
                <Link to="/tutors" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Browse Tutors
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content - Restructured: Favorite Tutors and Chat side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Favorite Tutors */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-4">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {currentUser?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{currentUser?.name}</h3>
                <p className="text-gray-500 text-sm">{currentUser?.email}</p>
                <button className="mt-4 text-indigo-500 hover:text-indigo-600 text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            </div>
            
            {/* Favorite Tutors Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaHeart className="text-red-500 mr-2" />
                  Favorite Tutors
                </h3>
                <Link to="/tutors" className="text-indigo-500 hover:text-indigo-600 text-sm font-medium">
                  Find More Tutors
                </Link>
              </div>
              
              {loadingFavorites ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : favoriteTutors.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {favoriteTutors.map(tutor => (
                    <div key={tutor._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                      {/* Remove button */}
                      <button 
                        onClick={() => handleRemoveFavorite(tutor._id)}
                        disabled={removingFavorite === tutor._id}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from favorites"
                      >
                        {removingFavorite === tutor._id ? (
                          <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaTimes />
                        )}
                      </button>
                      
                      <div className="flex items-start justify-between pr-8">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <img 
                              src={tutor.profilePicture || "https://via.placeholder.com/60x60?text=T"} 
                              alt={tutor.name} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-800">{tutor.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {Array.isArray(tutor.subjects) && tutor.subjects.length > 0
                                ? tutor.subjects.join(', ')
                                : "No subjects listed"}
                            </p>
                            
                            {tutor.rating && (
                              <div className="flex items-center mt-1">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                      key={i}
                                      className={i < Math.floor(tutor.rating) ? "text-yellow-400" : "text-gray-300"}
                                      size={14}
                                    />
                                  ))}
                                </div>
                                <span className="ml-1 text-xs text-gray-500">
                                  ({tutor.rating.toFixed(1)})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStartChat(tutor)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors text-sm flex items-center"
                          >
                            <FaComments className="mr-1" size={12} />
                            Chat
                          </button>
                          
                          <Link 
                            to={`/tutors/${tutor._id}`}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                      
                      {tutor.bio && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {tutor.bio}
                        </p>
                      )}
                      
                      {tutor.hourlyRate && (
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Hourly Rate:</span>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            ₹{tutor.hourlyRate}/hour
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <FaHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">You haven't added any tutors to favorites yet</p>
                  <Link to="/tutors" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition duration-200">
                    Find Tutors
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Chat Section */}
          <div>
            {showChatInterface ? (
              <ChatInterface 
                activeTutor={activeChatTutor} 
                onClose={() => {
                  setShowChatInterface(false);
                  setActiveChatTutor(null);
                }} 
              />
            ) : (
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-md h-full p-6 flex flex-col items-center justify-center border border-indigo-100">
                <div className="bg-blue-100 p-4 rounded-full mb-6">
                  <FaComments className="text-indigo-600 w-12 h-12" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Start a Conversation</h3>
                
                <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
                  Connect with your favorite tutors instantly! Select a tutor from your favorites list and click the chat button to begin learning together.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  {favoriteTutors.length > 0 ? (
                    <div className="flex -space-x-3 overflow-hidden">
                      {favoriteTutors.slice(0, 5).map((tutor, index) => (
                        <div key={tutor._id} className="relative hover:-translate-y-1 transition-transform duration-200">
                          <img 
                            src={tutor.profilePicture || "https://via.placeholder.com/50?text=T"} 
                            alt={tutor.name}
                            className="w-12 h-12 rounded-full border-2 border-white object-cover inline-block" 
                          />
                          <button 
                            onClick={() => handleStartChat(tutor)} 
                            className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors duration-200 shadow-md"
                            title={`Chat with ${tutor.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {favoriteTutors.length > 5 && (
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white bg-gray-200 text-xs font-semibold text-gray-700">
                          +{favoriteTutors.length - 5}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to="/tutors" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center shadow-md hover:shadow-lg">
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Find Tutors to Chat With
                    </Link>
                  )}
                </div>
                
                {favoriteTutors.length > 0 && (
                  <div className="mt-8 text-center">
                    <span className="block text-sm text-gray-500 mb-1">Need to find more tutors?</span>
                    <Link to="/tutors" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-center">
                      Browse All Tutors
                      <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
