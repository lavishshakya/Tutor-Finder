import React from 'react';
import { FaStar, FaRupeeSign, FaGraduationCap, FaUserGraduate } from 'react-icons/fa';
import { useProfileImage } from '../hooks/useProfileImage';

// Subject category colors mapping
const subjectColors = {
  // Sciences
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
    tutor.name
  );

  // Parse subjects from string to array if needed
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
    </div>
  );
};

export default TutorCard;