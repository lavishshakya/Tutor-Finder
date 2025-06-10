import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TutorProfileSetup = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(''); // Add image preview state
  
  // Predefined lists of subjects and classes
  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'English', 'Hindi', 'History', 'Geography', 'Computer Science',
    'Economics', 'Business Studies', 'Accountancy', 'Political Science',
    'Psychology', 'Sociology', 'Physical Education', 'Art', 'Music'
  ];
  
  const availableClasses = [
    'Pre-Primary', '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th', '11th', '12th',
    'Bachelors (UG)', 'Masters (PG)'
  ];
  
  const [formData, setFormData] = useState({
    qualifications: '',
    subjects: [],
    classes: [],
    hourlyRate: '',
    bio: '',
    profilePicture: null
  });
  
  // For managing dropdown UI state
  const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  
  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubjectDropdown || showClassDropdown) {
        // Check if the click is outside the dropdowns
        if (!event.target.closest('.subject-dropdown') && !event.target.closest('.subject-field')) {
          setShowSubjectDropdown(false);
        }
        if (!event.target.closest('.class-dropdown') && !event.target.closest('.class-field')) {
          setShowClassDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSubjectDropdown, showClassDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        profilePicture: file
      }));
      
      // Create a preview URL for the image
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // Subject selection handlers
  const toggleSubject = (subject) => {
    setFormData(prevState => {
      if (prevState.subjects.includes(subject)) {
        return {
          ...prevState,
          subjects: prevState.subjects.filter(s => s !== subject)
        };
      } else {
        return {
          ...prevState,
          subjects: [...prevState.subjects, subject]
        };
      }
    });
  };
  
  // Class selection handlers
  const toggleClass = (classItem) => {
    setFormData(prevState => {
      if (prevState.classes.includes(classItem)) {
        return {
          ...prevState,
          classes: prevState.classes.filter(c => c !== classItem)
        };
      } else {
        return {
          ...prevState,
          classes: [...prevState.classes, classItem]
        };
      }
    });
  };
  
  // Filter subjects based on search term
  const filteredSubjects = availableSubjects.filter(subject => 
    subject.toLowerCase().includes(subjectSearchTerm.toLowerCase())
  );
  
  // Filter classes based on search term
  const filteredClasses = availableClasses.filter(classItem => 
    classItem.toLowerCase().includes(classSearchTerm.toLowerCase())
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validation to ensure at least one subject and class are selected
    if (formData.subjects.length === 0) {
      setError('Please select at least one subject');
      setLoading(false);
      return;
    }
    
    if (formData.classes.length === 0) {
      setError('Please select at least one class');
      setLoading(false);
      return;
    }
    
    try {
      // First upload the image if exists
      let profilePictureUrl = '';
      if (formData.profilePicture) {
        const imageData = new FormData();
        imageData.append('file', formData.profilePicture);
        imageData.append('upload_preset', 'tutor_finder');
        
        // Using a placeholder URL for demonstration - replace with your Cloudinary account
        console.log('Uploading image to Cloudinary...');
        try {
          const response = await fetch('https://api.cloudinary.com/v1_1/tutorfinder/image/upload', {
            method: 'POST',
            body: imageData
          });
          
          if (!response.ok) {
            throw new Error('Image upload failed');
          }
          
          const data = await response.json();
          profilePictureUrl = data.secure_url;
          console.log('Image uploaded successfully:', profilePictureUrl);
        } catch (imageErr) {
          console.error('Image upload error:', imageErr);
          // Continue with profile creation even if image upload fails
          profilePictureUrl = 'https://via.placeholder.com/150?text=Tutor';
        }
      } else {
        // Default placeholder image
        profilePictureUrl = 'https://via.placeholder.com/150?text=Tutor';
      }
      
      // Now update the tutor profile
      const token = localStorage.getItem('token');
      console.log('Submitting profile data with token:', token?.substring(0, 10));
      
      const profileData = {
        subjects: formData.subjects,
        qualifications: formData.qualifications,
        classes: formData.classes.join(', '), // Join selected classes
        monthlyRate: parseFloat(formData.hourlyRate), // Renamed field to match schema
        bio: formData.bio,
        profilePicture: profilePictureUrl,
        availableTimeSlots: [] // Add this as an empty array for now
      };
      
      console.log('Profile data being submitted:', profileData);
      
      const profileResponse = await axios.put('http://localhost:5001/api/tutors/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Profile update response:', profileResponse.data);
      
      if (profileResponse.data.success) {
        navigate('/tutor-dashboard');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Profile setup error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Security check
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'tutor') {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser || currentUser.role !== 'tutor') {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Tutor Profile</h1>
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Profile Picture
              </label>
              <div className="flex flex-col md:flex-row items-center gap-4">
                {imagePreview && (
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img 
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Qualifications
              </label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g., M.Sc. in Mathematics, B.Ed."
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            {/* Subjects Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Subjects
              </label>
              <div className="relative">
                <div 
                  className="w-full p-2 border rounded flex flex-wrap gap-2 cursor-pointer min-h-[42px] subject-field"
                  onClick={() => setShowSubjectDropdown(true)}
                >
                  {formData.subjects.length === 0 && (
                    <span className="text-gray-400">Select subjects you can teach</span>
                  )}
                  {formData.subjects.map(subject => (
                    <span 
                      key={subject}
                      className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {subject}
                      <button
                        type="button"
                        className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubject(subject);
                        }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                
                {showSubjectDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto subject-dropdown">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Search subjects..."
                        value={subjectSearchTerm}
                        onChange={(e) => setSubjectSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map(subject => (
                          <div
                            key={subject}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                              formData.subjects.includes(subject) ? 'bg-indigo-50' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubject(subject);
                            }}
                          >
                            <div className={`w-4 h-4 mr-2 border rounded ${
                              formData.subjects.includes(subject) 
                                ? 'bg-indigo-500 border-indigo-500' 
                                : 'border-gray-400'
                            }`}>
                              {formData.subjects.includes(subject) && (
                                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            {subject}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No subjects found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {formData.subjects.length === 0 && (
                <p className="text-red-500 text-xs mt-1">Please select at least one subject</p>
              )}
            </div>
            
            {/* Classes Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Classes/Grades
              </label>
              <div className="relative">
                <div 
                  className="w-full p-2 border rounded flex flex-wrap gap-2 cursor-pointer min-h-[42px] class-field"
                  onClick={() => setShowClassDropdown(true)}
                >
                  {formData.classes.length === 0 && (
                    <span className="text-gray-400">Select classes you can teach</span>
                  )}
                  {formData.classes.map(classItem => (
                    <span 
                      key={classItem}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {classItem}
                      <button
                        type="button"
                        className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleClass(classItem);
                        }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                
                {showClassDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto class-dropdown">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Search classes..."
                        value={classSearchTerm}
                        onChange={(e) => setClassSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      {filteredClasses.length > 0 ? (
                        filteredClasses.map(classItem => (
                          <div
                            key={classItem}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                              formData.classes.includes(classItem) ? 'bg-green-50' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleClass(classItem);
                            }}
                          >
                            <div className={`w-4 h-4 mr-2 border rounded ${
                              formData.classes.includes(classItem) 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-400'
                            }`}>
                              {formData.classes.includes(classItem) && (
                                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            {classItem}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No classes found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {formData.classes.length === 0 && (
                <p className="text-red-500 text-xs mt-1">Please select at least one class</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Monthly Rate (₹)
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="e.g., 8000"
                className="w-full p-2 border rounded"
                min="0"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter your monthly fee for approximately 16 sessions</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell students about yourself, your teaching style, and experience"
                className="w-full p-2 border rounded"
                rows="4"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading || formData.subjects.length === 0 || formData.classes.length === 0}
              className={`w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded focus:outline-none ${
                loading || formData.subjects.length === 0 || formData.classes.length === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TutorProfileSetup;