import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaGraduationCap,
  FaBookOpen,
  FaChalkboard,
  FaClock,
  FaRupeeSign,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import RatingForm from "../components/RatingForm";
import { toast } from "react-toastify";
import FavoriteButton from "../components/FavoriteButton";
import { useProfileImage } from "../hooks/useProfileImage";
import { getApiUrl } from "../services/api";

const subjectColors = {
  Mathematics: "bg-blue-100 text-blue-800",
  Physics: "bg-indigo-100 text-indigo-800",
  Chemistry: "bg-purple-100 text-purple-800",
  Biology: "bg-green-100 text-green-800",
  "Computer Science": "bg-cyan-100 text-cyan-800",
  English: "bg-pink-100 text-pink-800",
  Hindi: "bg-pink-100 text-pink-800",
  History: "bg-amber-100 text-amber-800",
  Geography: "bg-yellow-100 text-yellow-800",
  Economics: "bg-emerald-100 text-emerald-800",
  Science: "bg-teal-100 text-teal-800",
  Programming: "bg-sky-100 text-sky-800",
  "Business Studies": "bg-orange-100 text-orange-800",
  Accountancy: "bg-rose-100 text-rose-800",
  "Political Science": "bg-fuchsia-100 text-fuchsia-800",

};

const TutorProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]); // Add this state to store the reviews
  const [isFavorite, setIsFavorite] = useState(false); // State to manage favorite status

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl(`/api/tutors/${id}`));


        if (response.data.success) {
          const tutorData = response.data.data;
          // Format data as needed
          setTutor({
            ...tutorData,
            subjects: Array.isArray(tutorData.subjects)
              ? tutorData.subjects
              : typeof tutorData.subjects === "string"
              ? tutorData.subjects.split(",").map((s) => s.trim())
              : [],
            classes:
              typeof tutorData.classes === "string"
                ? tutorData.classes.split(",").map((c) => c.trim())
                : Array.isArray(tutorData.classes)
                ? tutorData.classes
                : [],
            availableTimeSlots: Array.isArray(tutorData.availableTimeSlots)
              ? tutorData.availableTimeSlots
              : [],
          });
        } else {
          setError("Failed to load tutor profile");
        }
      } catch (err) {
        console.error("Error fetching tutor:", err);
        setError("Error loading tutor profile. Please try again.");

      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          getApiUrl(`/api/tutors/${id}/reviews`)
        );

        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);

      }
    };

    fetchTutor();
    fetchReviews();
  }, [id]);

  const fetchTutorData = async () => {
    try {
      const response = await axios.get(getApiUrl(`/api/tutors/${id}`));

      if (response.data.success) {
        const tutorData = response.data.data;
        setTutor({
          ...tutorData,
          subjects: Array.isArray(tutorData.subjects)
            ? tutorData.subjects
            : typeof tutorData.subjects === "string"
            ? tutorData.subjects.split(",").map((s) => s.trim())
            : [],
          classes:
            typeof tutorData.classes === "string"
              ? tutorData.classes.split(",").map((c) => c.trim())
              : Array.isArray(tutorData.classes)
              ? tutorData.classes
              : [],
          availableTimeSlots: Array.isArray(tutorData.availableTimeSlots)
            ? tutorData.availableTimeSlots
            : [],
        });
      }

      await fetchReviews();
    } catch (error) {
      console.error("Error fetching tutor data:", error);

    }
  };

  // Effect to check favorite status on mount and after toggling favorite
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentUser && currentUser.role === "parent") {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            getApiUrl(`/api/parents/check-favorite/${id}`),
            { headers: { Authorization: `Bearer ${token}` } }
          );


          if (response.data.success) {
            setIsFavorite(response.data.data.isFavorite);
          }
        } catch (err) {
          console.error("Error fetching favorite status:", err);

        }
      }
    };

    checkFavoriteStatus();
  }, [id, currentUser]);

  const { imageUrl: tutorProfileImage, handleImageError } = useProfileImage(
    tutor?.profilePicture,
    tutor?.name
  );

  if (loading) {
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
          <p>Loading tutor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="text-red-600 max-w-md text-center">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mb-4">{error}</p>
          <Link
            to="/tutors"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >

            Back to tutors list
          </Link>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="text-red-600 max-w-md text-center">
          <p className="mb-4">Tutor not found</p>
          <Link
            to="/tutors"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >

            Back to tutors list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 pt-24 pb-12">
      {/* Enhanced Hero Section with Profile Image and Summary */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-75"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-150"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Enhanced Profile Image */}
            <div className="md:mr-10 mb-6 md:mb-0 flex-shrink-0 relative group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <img
                  src={tutorProfileImage}
                  alt={tutor.name}
                  className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-white/50"

                  onError={(e) => {
                    e.target.src = handleImageError();
                  }}
                  crossOrigin="anonymous"
                />
                <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-3 border-4 border-white shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />

                  </svg>
                </div>
              </div>
            </div>

            {/* Enhanced Tutor Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex flex-col items-center md:items-start">
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
                    {tutor.name}
                  </h1>

                  {/* Enhanced Tutor Type Badge */}
                  {tutor.tutorType && (
                    <div
                      className={`mt-2 text-sm font-bold px-5 py-2 rounded-full shadow-lg backdrop-blur-sm bg-white/20 border-2 border-white/40 text-white flex items-center gap-2`}
                    >
                      {tutor.tutorType === "both" && (
                        <>
                          <span>🏠 Home</span>
                          <span className="text-white/60">•</span>
                          <span>🏫 Center Tutor</span>
                        </>
                      )}
                      {tutor.tutorType === "home" && "🏠 Home Tutor"}
                      {tutor.tutorType === "center" && "🏫 Center Tutor"}
                    </div>
                  )}

                  {/* Enhanced Rating Display */}
                  <div className="flex items-center mt-3 justify-center md:justify-start bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="flex text-yellow-300 text-lg">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(tutor.rating || 0)
                              ? "text-yellow-300 drop-shadow-md"
                              : "text-white/30"
                          }
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-bold text-lg">
                      {tutor.rating || "0"}
                    </span>
                    <span className="ml-1 text-white/80">
                      ({tutor.reviewCount || "0"} reviews)
                    </span>
                  </div>
                </div>

                {/* Enhanced Favorite Button */}
                {currentUser && currentUser.role === "parent" && (
                  <div className="mt-2 md:mt-0">
                    <FavoriteButton
                      tutorId={id}
                      buttonStyle="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-full p-3 transition-all duration-200 backdrop-blur-sm shadow-lg hover:scale-110"
                      iconSize="text-2xl"

                    />
                  </div>
                )}
              </div>

              <p className="mt-4 text-xl md:text-2xl text-white/95 font-medium">
                {tutor.qualifications}
              </p>

              {/* Enhanced Subject Tags */}
              <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                {tutor.subjects.slice(0, 6).map((subject, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-white/30 transition-all duration-200"

                  >
                    {subject}
                  </span>
                ))}
                {tutor.subjects.length > 6 && (
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full text-sm font-semibold">
                    +{tutor.subjects.length - 6} more
                  </span>
                )}
              </div>

              {/* Enhanced Contact Buttons */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                {tutor.phoneNumber && (
                  <a
                    href={`tel:${tutor.phoneNumber.replace(/\D/g, "")}`}
                    className="flex items-center bg-white text-gray-800 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 text-indigo-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Now
                  </a>
                )}

                {tutor.whatsappNumber && (
                  <a
                    href={`https://wa.me/${tutor.whatsappNumber.replace(
                      /\D/g,
                      ""
                    )}?text=Hello ${encodeURIComponent(
                      tutor.name
                    )}, I found your profile on Tutor Finder and would like to inquire about tutoring sessions.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />

                    </svg>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(249 250 251)"
            />
          </svg>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white border-b shadow-sm -mt-8 relative z-20">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 px-8 font-semibold text-base border-b-3 transition-all duration-200 whitespace-nowrap ${
                activeTab === "about"
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                About
              </div>
            </button>
            {(tutor.tutorType === "home" ||
              tutor.tutorType === "both" ||
              !tutor.tutorType) && (
              <button
                onClick={() => setActiveTab("schedule")}
                className={`py-4 px-8 font-semibold text-base border-b-3 transition-all duration-200 whitespace-nowrap ${
                  activeTab === "schedule"
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                    : "border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">🏠 Home Tuition</div>
              </button>
            )}
            {(tutor.tutorType === "center" || tutor.tutorType === "both") &&
              tutor.centerName && (
                <button
                  onClick={() => setActiveTab("center")}
                  className={`py-4 px-8 font-semibold text-base border-b-3 transition-all duration-200 whitespace-nowrap ${
                    activeTab === "center"
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                      : "border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    🏫 Tuition Center
                  </div>
                </button>
              )}
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-8 font-semibold text-base border-b-3 transition-all duration-200 whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Reviews
              </div>

            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {/* About Tab */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Enhanced About Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2.5 rounded-xl">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  About {tutor.name}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {tutor.bio || "No bio information provided."}
                  </p>
                </div>
              </div>

              {/* Enhanced Teaching Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-2.5 rounded-xl">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  Teaching Details
                </h2>

                <div className="space-y-6">
                  {/* Subjects */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                      <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-2 rounded-lg mr-3">
                        <FaBookOpen className="text-pink-600" />
                      </div>

                      Subjects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject, idx) => {
                        const colorClass =
                          subjectColors[subject] || "bg-gray-100 text-gray-800";
                        return (
                          <span
                            key={idx}
                            className={`${colorClass} px-4 py-2 rounded-lg text-sm font-semibold shadow-sm`}

                          >
                            {subject}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Classes/Grades */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-lg mr-3">
                        <FaChalkboard className="text-green-600" />
                      </div>

                      Classes/Grades
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.classes.map((cls, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"

                        >
                          {cls === "College" ? cls : `Class ${cls}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
                      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2 rounded-lg mr-3">
                        <FaGraduationCap className="text-indigo-600" />
                      </div>
                      Qualifications
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {tutor.qualifications}
                    </p>

                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-6">
              {/* Enhanced Price Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white border border-indigo-400">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaRupeeSign className="text-yellow-300" />
                  Pricing
                </h2>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold">
                    {tutor.monthlyRate || tutor.hourlyRate || "N/A"}
                  </span>
                  <span className="text-xl ml-2 font-medium text-white/80">
                    /month
                  </span>
                </div>
                <p className="mt-3 text-white/90 text-sm">
                  Flexible payment options available
                </p>
              </div>

              {/* Enhanced Additional Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Contact Info
                </h2>

                {/* Add Contact Information */}
                {(tutor.phoneNumber || tutor.whatsappNumber) && (
                  <div className="mb-6 space-y-3">
                    {tutor.phoneNumber && (
                      <div className="flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                          <svg
                            className="w-5 h-5 text-indigo-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <span className="text-gray-800 font-medium">
                          {tutor.phoneNumber}
                        </span>
                      </div>
                    )}

                    {tutor.whatsappNumber && (
                      <div className="space-y-2">
                        <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                          <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <svg
                              className="w-5 h-5 text-green-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                            >
                              <path
                                fill="currentColor"
                                d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-800 font-medium">
                            {tutor.whatsappNumber}
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/${tutor.whatsappNumber.replace(
                            /\D/g,
                            ""
                          )}?text=Hello ${encodeURIComponent(
                            tutor.name
                          )}, I found your profile on Tutor Finder and would like to inquire about tutoring sessions.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 w-full font-semibold shadow-md hover:shadow-lg"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                          </svg>
                          Message on WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t pt-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Why Choose This Tutor?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-green-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">
                        Professional teacher with{" "}
                        {tutor.experience || "relevant"} experience
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-green-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">
                        Personalized learning approach
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-green-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">
                        Regular assessments and feedback
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-green-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">
                        Study materials provided
                      </span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Home Tuition Tab */}
        {activeTab === "schedule" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              🏠 Home Tuition Availability
            </h2>

            <div className="mb-6">
              <p className="text-gray-700">
                Below are the time slots when {tutor.name} is available for
                teaching sessions. Contact the tutor to book a session during
                one of these times.
              </p>
            </div>

            {tutor.availableTimeSlots && tutor.availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tutor.availableTimeSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-4 flex items-center"
                  >

                    <FaClock className="text-indigo-500 mr-3" />
                    <span className="text-gray-800">{slot}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600">
                  No time slots have been specified by this tutor.
                </p>
                <p className="mt-2 text-gray-500">
                  Please contact the tutor to inquire about their availability.
                </p>

              </div>
            )}
          </div>
        )}

        {/* Tuition Center Info Tab - Only show if tutor has center */}
        {(tutor.tutorType === "center" || tutor.tutorType === "both") &&
          tutor.centerName &&
          activeTab === "center" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <svg
                  className="w-7 h-7 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Tuition Center Information
              </h2>

              {/* Center Name */}
              <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {tutor.centerName}
                </h3>
                {tutor.centerAddress && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <svg
                      className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{tutor.centerAddress}</span>
                  </div>
                )}
              </div>

              {/* Class Schedule */}
              {tutor.centerClasses && tutor.centerClasses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Class Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tutor.centerClasses.map((classItem, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-indigo-300 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                            {classItem.day}
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            {classItem.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-gray-500"
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
                            <span className="font-medium text-gray-800">
                              {classItem.subject}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <svg
                              className="w-4 h-4"
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
                            <span className="text-sm">
                              {classItem.capacity} seats
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Student Reviews
            </h2>


            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex items-center text-yellow-400 text-3xl mr-4">
                  {tutor.rating || "0"}
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(tutor.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  Based on {tutor.reviewCount || "0"} reviews
                </span>
              </div>
            </div>


            {/* Reviews Section - Fetched from API */}
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-6 last:border-b-0"
                  >

                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          {review.parentProfilePicture ? (
                            <img
                              src={review.parentProfilePicture}
                              alt={review.parentName}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e5e7eb' width='40' height='40'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EP%3C/text%3E%3C/svg%3E";

                              }}
                            />
                          ) : (
                            <span className="font-semibold text-indigo-600">
                              {review.parentName
                                ? review.parentName.charAt(0)
                                : "P"}

                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {review.parentName || "Parent"}
                          </p>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />

                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {new Date(review.date).toLocaleDateString()}
                      </p>

                    </div>
                    <p className="mt-3 text-gray-700">
                      {review.review || "No written review provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-gray-600">No reviews yet for this tutor.</p>
                <p className="mt-2 text-gray-500">
                  Be the first to share your experience!
                </p>

              </div>
            )}
          </div>
        )}

        {/* Review Form - Shown to parents for submitting reviews */}
        {currentUser && currentUser.role === "parent" && (
          <div className="mt-6 container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              {showReviewForm ? (
                <RatingForm
                  tutorId={id}

                  onSuccess={() => {
                    setShowReviewForm(false);
                    // Refresh tutor data to show updated ratings
                    fetchTutorData();
                  }}
                />
              ) : (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Rate & Review This Tutor
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorProfile;

