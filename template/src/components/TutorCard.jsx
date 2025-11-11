<<<<<<< HEAD
import React from 'react';
import { FaStar, FaRupeeSign, FaGraduationCap, FaUserGraduate } from 'react-icons/fa';
import { useProfileImage } from '../hooks/useProfileImage';
=======
import React from "react";
import {
  FaStar,
  FaRupeeSign,
  FaGraduationCap,
  FaUserGraduate,
} from "react-icons/fa";
import { useProfileImage } from "../hooks/useProfileImage";
>>>>>>> 181f83f (Updated Features)

// Subject category colors mapping
const subjectColors = {
  // Sciences
<<<<<<< HEAD
  'Mathematics': 'bg-blue-100 text-blue-800',
  'Physics': 'bg-indigo-100 text-indigo-800',
  'Chemistry': 'bg-purple-100 text-purple-800',
  'Biology': 'bg-green-100 text-green-800',
  'Computer Science': 'bg-cyan-100 text-cyan-800',
  
  // Languages
  'English': 'bg-pink-100 text-pink-800',
  'Hindi': 'bg-pink-100 text-pink-800',
  
  // Humanities
  'History': 'bg-amber-100 text-amber-800',
  'Geography': 'bg-yellow-100 text-yellow-800',
  'Economics': 'bg-emerald-100 text-emerald-800',
  'Business Studies': 'bg-teal-100 text-teal-800',
  'Accountancy': 'bg-sky-100 text-sky-800',
  'Political Science': 'bg-orange-100 text-orange-800',
  
  // Arts
  'Psychology': 'bg-rose-100 text-rose-800',
  'Sociology': 'bg-fuchsia-100 text-fuchsia-800',
  'Physical Education': 'bg-lime-100 text-lime-800',
  'Art': 'bg-violet-100 text-violet-800',
  'Music': 'bg-purple-100 text-purple-800'
};

// Default color for subjects not in our mapping
const defaultSubjectColor = 'bg-gray-100 text-gray-800';

const TutorCard = ({ tutor }) => {
  const { imageUrl: tutorImageUrl, handleImageError } = useProfileImage(
    tutor.profilePicture || tutor.image, 
=======
  Mathematics: "bg-blue-100 text-blue-800",
  Physics: "bg-indigo-100 text-indigo-800",
  Chemistry: "bg-purple-100 text-purple-800",
  Biology: "bg-green-100 text-green-800",
  "Computer Science": "bg-cyan-100 text-cyan-800",

  // Languages
  English: "bg-pink-100 text-pink-800",
  Hindi: "bg-pink-100 text-pink-800",

  // Humanities
  History: "bg-amber-100 text-amber-800",
  Geography: "bg-yellow-100 text-yellow-800",
  Economics: "bg-emerald-100 text-emerald-800",
  "Business Studies": "bg-teal-100 text-teal-800",
  Accountancy: "bg-sky-100 text-sky-800",
  "Political Science": "bg-orange-100 text-orange-800",

  // Arts
  Psychology: "bg-rose-100 text-rose-800",
  Sociology: "bg-fuchsia-100 text-fuchsia-800",
  "Physical Education": "bg-lime-100 text-lime-800",
  Art: "bg-violet-100 text-violet-800",
  Music: "bg-purple-100 text-purple-800",
};

// Default color for subjects not in our mapping
const defaultSubjectColor = "bg-gray-100 text-gray-800";

const TutorCard = ({ tutor }) => {
  const { imageUrl: tutorImageUrl, handleImageError } = useProfileImage(
    tutor.profilePicture || tutor.image,
>>>>>>> 181f83f (Updated Features)
    tutor.name
  );

  // Parse subjects from string to array if needed
<<<<<<< HEAD
  const subjectArray = typeof tutor.subjects === 'string' 
    ? tutor.subjects.split(',').map(s => s.trim()) 
    : Array.isArray(tutor.subjects) ? tutor.subjects : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        {/* Tutor Image */}
        <div className="md:w-1/3 md:flex-shrink-0">
          <img 
            className="h-48 w-full md:h-full object-cover" 
            src={tutorImageUrl} 
            alt={tutor.name} 
            onError={(e) => {
              e.target.src = handleImageError();
            }}
            crossOrigin="anonymous"
          />
        </div>
        
        {/* Tutor Information */}
        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div>
            {/* Header with Name and Rating */}
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold text-gray-800">{tutor.name}</h2>
              
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-gray-700 font-medium">{tutor.rating || 0}</span>
                </div>
                <span className="text-sm text-gray-500">({tutor.reviewCount || 0} reviews)</span>
              </div>
            </div>
            
            {/* Qualifications */}
            <div className="flex items-start mb-3">
              <FaGraduationCap className="text-indigo-500 mt-1 mr-2" />
              <span className="text-gray-700">{tutor.qualifications}</span>
            </div>
            
            {/* Classes/Grades */}
            <div className="flex items-start mb-3">
              <FaUserGraduate className="text-indigo-500 mt-1 mr-2" />
              <span className="text-gray-700">Classes: {tutor.classes}</span>
            </div>
            
            {/* Subjects - Enhanced with colorful pills */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-600 mb-1.5">Subjects:</div>
              <div className="flex flex-wrap gap-2">
                {subjectArray.length > 0 ? (
                  subjectArray.map((subject, index) => (
                    <span 
                      key={index} 
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${subjectColors[subject] || defaultSubjectColor}`}
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No subjects specified</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer with Price and Contact Button */}
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200">
            <div className="flex items-center">
              <FaRupeeSign className="text-green-600" />
              <span className="font-semibold text-lg text-green-600 ml-1">
                {tutor.hourlyRate.replace('₹', '')}
              </span>
              <span className="text-gray-500 text-sm ml-1">/ hour</span>
            </div>
            
            <button 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200 text-sm font-medium"
            >
              Contact Tutor
            </button>
          </div>
        </div>
      </div>
=======
  const subjectArray =
    typeof tutor.subjects === "string"
      ? tutor.subjects.split(",").map((s) => s.trim())
      : Array.isArray(tutor.subjects)
      ? tutor.subjects
      : [];

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1">
      {/* Tutor Image with Gradient Overlay */}
      <div className="relative h-56 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={tutorImageUrl}
          alt={tutor.name}
          onError={(e) => {
            e.target.src = handleImageError();
          }}
          crossOrigin="anonymous"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="text-gray-800 font-bold text-sm">
            {tutor.rating || "5.0"}
          </span>
          <span className="text-gray-500 text-xs">
            ({tutor.reviewCount || 0})
          </span>
        </div>

        {/* Tutor Type Badge */}
        {tutor.tutorType && (
          <div className="absolute top-4 left-4">
            {tutor.tutorType === "both" ? (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                🏠 Home & 🏫 Center
              </div>
            ) : tutor.tutorType === "center" ? (
              <div className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                🏫 Center Tutor
              </div>
            ) : (
              <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                🏠 Home Tutor
              </div>
            )}
          </div>
        )}

        {/* Name at Bottom of Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {tutor.name}
          </h2>
        </div>
      </div>

      {/* Tutor Information */}
      <div className="p-5">
        {/* Qualifications */}
        <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
          <div className="bg-indigo-600 rounded-lg p-2">
            <FaGraduationCap className="text-white text-lg" />
          </div>
          <span className="text-gray-800 font-medium text-sm">
            {tutor.qualifications}
          </span>
        </div>

        {/* Classes/Grades */}
        <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-lg p-3">
          <div className="bg-purple-600 rounded-lg p-2">
            <FaUserGraduate className="text-white text-lg" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">
              Teaching Classes
            </span>
            <p className="text-gray-800 font-semibold text-sm">
              {tutor.classes}
            </p>
          </div>
        </div>

        {/* Subjects - Colorful Pills */}
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
            Subjects
          </div>
          <div className="flex flex-wrap gap-2">
            {subjectArray.length > 0 ? (
              subjectArray.slice(0, 4).map((subject, index) => (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                    subjectColors[subject] || defaultSubjectColor
                  }`}
                >
                  {subject}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic text-sm">
                No subjects specified
              </span>
            )}
            {subjectArray.length > 4 && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-200 text-gray-700">
                +{subjectArray.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Price and Contact Button */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div>
            <div className="text-xs text-gray-600 font-medium mb-0.5">
              Monthly Fee
            </div>
            <div className="flex items-center">
              <FaRupeeSign className="text-green-600 text-lg" />
              <span className="font-bold text-2xl text-green-600 ml-1">
                {tutor.hourlyRate.replace("₹", "")}
              </span>
            </div>
          </div>

          <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105">
            View Profile
          </button>
        </div>
      </div>
>>>>>>> 181f83f (Updated Features)
    </div>
  );
};

<<<<<<< HEAD
export default TutorCard;
=======
export default TutorCard;
>>>>>>> 181f83f (Updated Features)
