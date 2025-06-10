import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaGraduationCap, FaBookOpen, FaChalkboard, FaClock, FaRupeeSign, FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RatingForm from '../components/RatingForm';
import { toast } from 'react-toastify';
import FavoriteButton from '../components/FavoriteButton';
import { useProfileImage } from '../hooks/useProfileImage';

const subjectColors = {
  'Mathematics': 'bg-blue-100 text-blue-800',
  'Physics': 'bg-indigo-100 text-indigo-800',
  'Chemistry': 'bg-purple-100 text-purple-800',
  'Biology': 'bg-green-100 text-green-800',
  'Computer Science': 'bg-cyan-100 text-cyan-800',
  'English': 'bg-pink-100 text-pink-800',
  'Hindi': 'bg-pink-100 text-pink-800',
  'History': 'bg-amber-100 text-amber-800',
  'Geography': 'bg-yellow-100 text-yellow-800',
  'Economics': 'bg-emerald-100 text-emerald-800',
  'Science': 'bg-teal-100 text-teal-800',
  'Programming': 'bg-sky-100 text-sky-800',
  'Business Studies': 'bg-orange-100 text-orange-800',
  'Accountancy': 'bg-rose-100 text-rose-800',
  'Political Science': 'bg-fuchsia-100 text-fuchsia-800',
};

const TutorProfile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]); // Add this state to store the reviews
  const [isFavorite, setIsFavorite] = useState(false); // State to manage favorite status

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/tutors/${id}`);
        
        if (response.data.success) {
          const tutorData = response.data.data;
          // Format data as needed
          setTutor({
            ...tutorData,
            subjects: Array.isArray(tutorData.subjects) ? tutorData.subjects : 
                     (typeof tutorData.subjects === 'string' ? tutorData.subjects.split(',').map(s => s.trim()) : []),
            classes: typeof tutorData.classes === 'string' ? 
                    tutorData.classes.split(',').map(c => c.trim()) : 
                    (Array.isArray(tutorData.classes) ? tutorData.classes : []),
            availableTimeSlots: Array.isArray(tutorData.availableTimeSlots) ? tutorData.availableTimeSlots : []
          });
        } else {
          setError('Failed to load tutor profile');
        }
      } catch (err) {
        console.error('Error fetching tutor:', err);
        setError('Error loading tutor profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/tutors/${id}/reviews`);
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchTutor();
    fetchReviews();
  }, [id]);

  const fetchTutorData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/tutors/${id}`);
      if (response.data.success) {
        const tutorData = response.data.data;
        setTutor({
          ...tutorData,
          subjects: Array.isArray(tutorData.subjects) ? tutorData.subjects : 
                   (typeof tutorData.subjects === 'string' ? tutorData.subjects.split(',').map(s => s.trim()) : []),
          classes: typeof tutorData.classes === 'string' ? 
                  tutorData.classes.split(',').map(c => c.trim()) : 
                  (Array.isArray(tutorData.classes) ? tutorData.classes : []),
          availableTimeSlots: Array.isArray(tutorData.availableTimeSlots) ? tutorData.availableTimeSlots : []
        });
      }
      
      await fetchReviews();
    } catch (error) {
      console.error('Error fetching tutor data:', error);
    }
  };

  // Effect to check favorite status on mount and after toggling favorite
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentUser && currentUser.role === 'parent') {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:5001/api/parents/favorite-status/${id}`,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          
          if (response.data.success) {
            setIsFavorite(response.data.data.isFavorite);
          }
        } catch (err) {
          console.error('Error fetching favorite status:', err);
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
          <svg className="w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
          <svg className="w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mb-4">{error}</p>
          <Link to="/tutors" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200">
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
          <Link to="/tutors" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-200">
            Back to tutors list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero Section with Profile Image and Summary - Updated with more formal colors */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Profile Image */}
            <div className="md:mr-10 mb-6 md:mb-0 flex-shrink-0">
              <div className="relative">
                <img 
                  src={tutorProfileImage} 
                  alt={tutor.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl"
                  onError={(e) => {
                    e.target.src = handleImageError();
                  }}
                  crossOrigin="anonymous"
                />
                <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-2 border-4 border-white">
                  <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Tutor Info */}
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-4xl font-bold">{tutor.name}</h1>
                
                {/* Add favorite button here for logged in parents */}
                {currentUser && currentUser.role === 'parent' && (
                  <div className="mt-2 md:mt-0 md:ml-4">
                    <FavoriteButton 
                      tutorId={id} 
                      buttonStyle="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 rounded-full p-2.5 transition-all duration-200"
                      iconSize="text-xl"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center mt-2 justify-center md:justify-start">
                <div className="flex text-yellow-300">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(tutor.rating || 0) ? "text-yellow-300" : "text-gray-400 opacity-50"} />
                  ))}
                </div>
                <span className="ml-2">{tutor.rating || "0"} ({tutor.reviewCount || "0"} reviews)</span>
              </div>
              
              <p className="mt-3 text-xl opacity-90">{tutor.qualifications}</p>
              
              {/* Fixed line - there was a dangling closing tag here */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {tutor.subjects.map((subject, idx) => (
                  <span 
                    key={idx} 
                    className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {tutor.phoneNumber && (
                  <a 
                    href={`tel:${tutor.phoneNumber.replace(/\D/g, '')}`}
                    className="flex items-center bg-white text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition duration-200 shadow-sm"
                  >
                    <svg className="w-5 h-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call
                  </a>
                )}
                
                {tutor.whatsappNumber && (
                  <a 
                    href={`https://wa.me/${tutor.whatsappNumber.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(tutor.name)}, I found your profile on Tutor Finder and would like to inquire about tutoring sessions.`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition duration-200 shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('about')} 
              className={`py-4 px-6 font-medium text-lg border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'about' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-indigo-600'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => setActiveTab('schedule')} 
              className={`py-4 px-6 font-medium text-lg border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'schedule' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-indigo-600'
              }`}
            >
              Availability
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`py-4 px-6 font-medium text-lg border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-indigo-600'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">About {tutor.name}</h2>
                <div className="prose max-w-none">
                  <p>{tutor.bio || "No bio information provided."}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teaching Details</h2>
                
                <div className="space-y-6">
                  {/* Subjects */}
                  <div>
                    <h3 className="flex items-center text-lg font-medium text-gray-800 mb-3">
                      <FaBookOpen className="text-indigo-500 mr-2" />
                      Subjects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject, idx) => {
                        const colorClass = subjectColors[subject] || 'bg-gray-100 text-gray-800';
                        return (
                          <span 
                            key={idx} 
                            className={`${colorClass} px-3 py-1.5 rounded-full text-sm font-medium`}
                          >
                            {subject}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Classes/Grades */}
                  <div>
                    <h3 className="flex items-center text-lg font-medium text-gray-800 mb-3">
                      <FaChalkboard className="text-indigo-500 mr-2" />
                      Classes/Grades
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.classes.map((cls, idx) => (
                        <span 
                          key={idx} 
                          className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {cls === "College" ? cls : `Class ${cls}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Qualifications */}
                  <div>
                    <h3 className="flex items-center text-lg font-medium text-gray-800 mb-3">
                      <FaGraduationCap className="text-indigo-500 mr-2" />
                      Qualifications
                    </h3>
                    <p className="text-gray-700">{tutor.qualifications}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Price</h2>
                <div className="flex items-center text-3xl font-bold text-indigo-600">
                  <FaRupeeSign className="mr-1" />
                  <span>{tutor.monthlyRate || tutor.hourlyRate || "Not specified"}</span>
                  <span className="text-lg ml-1 font-medium text-gray-500">/month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
                
                {/* Add Contact Information */}
                {(tutor.phoneNumber || tutor.whatsappNumber) && (
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      {tutor.phoneNumber && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-gray-700">{tutor.phoneNumber}</span>
                        </div>
                      )}
                      
                      {tutor.whatsappNumber && (
                        <div className="flex flex-col">
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                              <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                            </svg>
                            <span className="text-gray-700">{tutor.whatsappNumber}</span>
                          </div>
                          
                          <a 
                            href={`https://wa.me/${tutor.whatsappNumber.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(tutor.name)}, I found your profile on Tutor Finder and would like to inquire about tutoring sessions.`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-200 w-full"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                            </svg>
                            Message on WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Professional teacher with {tutor.experience || "relevant"} experience</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Personalized learning approach</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Regular assessments and feedback</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Study materials provided</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tutor Availability</h2>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Below are the time slots when {tutor.name} is available for teaching sessions. 
                Contact the tutor to book a session during one of these times.
              </p>
            </div>
            
            {tutor.availableTimeSlots && tutor.availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tutor.availableTimeSlots.map((slot, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 flex items-center">
                    <FaClock className="text-indigo-500 mr-3" />
                    <span className="text-gray-800">{slot}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">No time slots have been specified by this tutor.</p>
                <p className="mt-2 text-gray-500">Please contact the tutor to inquire about their availability.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Reviews</h2>
            
            <div className="mb-8">
              <div className="flex items-center">
                <div className="flex items-center text-yellow-400 text-3xl mr-4">
                  {tutor.rating || "0"}
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(tutor.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">Based on {tutor.reviewCount || "0"} reviews</span>
              </div>
            </div>
            
            {/* Reviews Section - Fetched from API */}
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
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
                                e.target.src = "https://via.placeholder.com/40?text=P";
                              }}
                            />
                          ) : (
                            <span className="font-semibold text-indigo-600">
                              {review.parentName ? review.parentName.charAt(0) : "P"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{review.parentName || "Parent"}</p>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <p className="mt-3 text-gray-700">
                      {review.review || "No written review provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-gray-600">No reviews yet for this tutor.</p>
                <p className="mt-2 text-gray-500">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        )}
        
        {/* Review Form - Shown to parents for submitting reviews */}
        {currentUser && currentUser.role === 'parent' && (
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