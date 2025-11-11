import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import RatingForm from "../components/RatingForm";
import ChatInterface from "../components/ChatInterface";
import { FaComments, FaHeart, FaStar, FaTimes } from "react-icons/fa";
import { getApiUrl } from "../services/api";


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
      navigate("/login");
      return;
    }


    // Fetch favorite tutors
    const fetchFavoriteTutors = async () => {
      try {
        setLoadingFavorites(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token not found");
          setLoadingFavorites(false);
          return;
        }

        const response = await axios.get(getApiUrl("/api/favorites"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          // Filter out blob URLs from tutor profile pictures
          const cleanedFavorites = response.data.data.map((tutor) => ({
            ...tutor,
            profilePicture:
              tutor.profilePicture && !tutor.profilePicture.startsWith("blob:")
                ? tutor.profilePicture
                : null,
          }));
          setFavoriteTutors(cleanedFavorites);
        } else {
          console.error("Failed to load favorites");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorite tutors:", error);

        setLoading(false);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavoriteTutors();

    // Fetch tutors for ratings
    const fetchTutorsForParent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          getApiUrl("/api/parents/favorite-tutors"),
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          // Filter out blob URLs from tutor profile pictures
          const cleanedTutors = response.data.data.map((tutor) => ({
            ...tutor,
            profilePicture:
              tutor.profilePicture && !tutor.profilePicture.startsWith("blob:")
                ? tutor.profilePicture
                : null,
          }));
          setTutors(cleanedTutors);
        }
      } catch (err) {
        console.error("Error fetching tutors:", err);
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
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.delete(
        getApiUrl(`/api/favorites/${tutorId}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update state to remove the tutor from favorites
        setFavoriteTutors((prev) =>
          prev.filter((tutor) => tutor._id !== tutorId)
        );
      } else {
        throw new Error("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing tutor from favorites:", error);
      alert("Failed to remove tutor from favorites. Please try again.");

    } finally {
      setRemovingFavorite(null);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="animate-pulse text-indigo-600 font-medium">
          <svg
            className="w-12 h-12 mx-auto mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />

          </svg>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Parent Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your learning journey</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link
              to="/edit-parent-profile"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl transition-all duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
          <div className="flex items-center relative z-10">
            <div className="hidden sm:block mr-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <svg
                  className="w-14 h-14"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />

                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {currentUser?.name}! 👋
              </h2>
              <p className="text-white/90 text-lg">
                Find and connect with the best tutors for your educational
                journey
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-md">
                <svg
                  className="w-8 h-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-gray-500 text-sm font-medium">
                  Favorite Tutors
                </h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {favoriteTutors.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-4 rounded-2xl shadow-md">
                  <svg
                    className="w-8 h-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-gray-500 text-sm font-medium">
                    Find New Tutors
                  </h3>
                  <Link
                    to="/tutors"
                    className="text-indigo-600 hover:text-indigo-800 text-base font-semibold flex items-center mt-1"
                  >
                    Browse Now
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>


        {/* Main Content - Restructured: Favorite Tutors and Chat side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Favorite Tutors */}
          <div className="space-y-6">
            {/* Enhanced Profile Card */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-6 border border-indigo-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-300">
                    <span className="text-3xl font-bold text-white">
                      {currentUser?.name?.charAt(0).toUpperCase() || "P"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {currentUser?.name}
                </h3>
                <p className="text-gray-500 text-sm mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {currentUser?.email}
                </p>

                <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {favoriteTutors.length}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Favorites
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {currentUser?.role === "parent" ? "Parent" : "User"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Account</div>
                    </div>
                  </div>
                </div>

                <Link
                  to="/edit-parent-profile"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Favorite Tutors Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <div className="bg-gradient-to-br from-red-400 to-pink-500 p-2 rounded-xl mr-3 shadow-md">
                    <FaHeart className="text-white" size={18} />
                  </div>
                  Favorite Tutors
                </h3>
                <Link
                  to="/tutors"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center group"
                >
                  Find More
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {loadingFavorites ? (
                <div className="flex justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
                  </div>
                </div>
              ) : favoriteTutors.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {favoriteTutors.map((tutor) => (
                    <div
                      key={tutor._id}
                      className="bg-gradient-to-br from-gray-50 to-indigo-50 p-4 rounded-xl border border-indigo-100 relative hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveFavorite(tutor._id)}
                        disabled={removingFavorite === tutor._id}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200"

                        title="Remove from favorites"
                      >
                        {removingFavorite === tutor._id ? (
                          <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaTimes size={14} />
                        )}
                      </button>

                      <div className="flex items-start justify-between pr-10">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={
                                tutor.profilePicture ||
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%23e5e7eb' width='60' height='60'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E"
                              }
                              alt={tutor.name}
                              className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-200 shadow-md"
                            />
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-base">
                              {tutor.name}
                            </h4>
                            <p className="text-sm text-indigo-600 font-medium mt-1">
                              {Array.isArray(tutor.subjects) &&
                              tutor.subjects.length > 0
                                ? tutor.subjects.join(", ")
                                : "No subjects listed"}
                            </p>

                            {tutor.rating && (
                              <div className="flex items-center mt-2">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={
                                        i < Math.floor(tutor.rating)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }
                                      size={16}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-600 font-semibold">
                                  {tutor.rating.toFixed(1)}

                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {tutor.bio && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {tutor.bio}
                        </p>
                      )}

                      <div className="mt-4 flex justify-between items-center">
                        {tutor.hourlyRate && (
                          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm">
                            ₹{tutor.hourlyRate}/hour
                          </span>
                        )}

                        <div className="flex space-x-2 ml-auto">
                          <button
                            onClick={() => handleStartChat(tutor)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm flex items-center shadow-md hover:shadow-lg hover:scale-105"
                          >
                            <FaComments className="mr-1.5" size={14} />
                            Chat
                          </button>

                          <Link
                            to={`/tutors/${tutor._id}`}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg hover:scale-105"

                          >
                            View
                          </Link>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <FaHeart className="w-10 h-10 text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    No Favorites Yet
                  </h4>
                  <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                    Start building your learning network by adding tutors to
                    your favorites
                  </p>
                  <Link
                    to="/tutors"
                    className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>

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

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Start a Conversation
                </h3>

                <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
                  Connect with your favorite tutors instantly! Select a tutor
                  from your favorites list and click the chat button to begin
                  learning together.
                </p>


                <div className="flex flex-wrap gap-4 justify-center">
                  {favoriteTutors.length > 0 ? (
                    <div className="flex -space-x-3 overflow-hidden">
                      {favoriteTutors.slice(0, 5).map((tutor, index) => (
                        <div
                          key={tutor._id}
                          className="relative hover:-translate-y-1 transition-transform duration-200"
                        >
                          <img
                            src={
                              tutor.profilePicture ||
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%23e5e7eb' width='50' height='50'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E"
                            }
                            alt={tutor.name}
                            className="w-12 h-12 rounded-full border-2 border-white object-cover inline-block"
                          />
                          <button
                            onClick={() => handleStartChat(tutor)}
                            className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors duration-200 shadow-md"
                            title={`Chat with ${tutor.name}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />

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
                    <Link
                      to="/tutors"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center shadow-md hover:shadow-lg"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />

                      </svg>
                      Find Tutors to Chat With
                    </Link>
                  )}
                </div>

                {favoriteTutors.length > 0 && (
                  <div className="mt-8 text-center">
                    <span className="block text-sm text-gray-500 mb-1">
                      Need to find more tutors?
                    </span>
                    <Link
                      to="/tutors"
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-center"
                    >
                      Browse All Tutors
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />

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
