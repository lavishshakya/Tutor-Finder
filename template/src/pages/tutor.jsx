import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaFilter, FaGraduationCap, FaBookOpen, FaChalkboard } from 'react-icons/fa';
import axios from 'axios';

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

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // Fetch tutors from API
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/tutors');
        
        if (response.data.success) {
          // Format the tutor data for display
          const formattedTutors = response.data.data.map(tutor => ({
            id: tutor._id,
            name: tutor.name,
            image: tutor.profilePicture || "https://via.placeholder.com/300x300?text=Tutor",
            qualifications: tutor.qualifications || "Not specified",
            classes: tutor.classes || "Not specified",
            subjects: Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : "Not specified",
            rating: tutor.rating || 0,
            reviewCount: tutor.reviewCount || 0,
            // Use monthlyRate if available, fall back to hourlyRate for backward compatibility
            monthlyRate: tutor.monthlyRate ? `₹${tutor.monthlyRate}` : (tutor.hourlyRate ? `₹${tutor.hourlyRate}` : "Not specified")
          }));
          
          setTutors(formattedTutors);
        } else {
          setError('Failed to load tutors');
        }
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTutors();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubjectFilter = (e) => {
    setSubjectFilter(e.target.value);
  };

  const handleClassFilter = (e) => {
    setClassFilter(e.target.value);
  };

  // Filter tutors based on search term and filters
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tutor.subjects.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === '' || tutor.subjects.toLowerCase().includes(subjectFilter.toLowerCase());
    
    const matchesClass = classFilter === '' || tutor.classes.includes(classFilter);
    
    return matchesSearch && matchesSubject && matchesClass;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Page Header */}
      <div className="bg-indigo-700 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Find Your Perfect Tutor</h1>
          <p className="mt-2">Browse through our qualified tutors and find the one that matches your learning needs</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search by name or subject */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or subject"
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Filter by subject */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBookOpen className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={subjectFilter}
                onChange={handleSubjectFilter}
              >
                <option value="">All Subjects</option>
                <option value="mathematics">Mathematics</option>
                <option value="english">English</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="programming">Programming</option>
                <option value="history">History</option>
                <option value="science">Science</option>
              </select>
            </div>

            {/* Filter by class */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaChalkboard className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={classFilter}
                onChange={handleClassFilter}
              >
                <option value="">All Classes</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            {/* Clear filters button */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSubjectFilter('');
                  setClassFilter('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-6">
          <p className="text-gray-700">
            Showing {filteredTutors.length} of {tutors.length} tutors
            {(searchTerm || subjectFilter || classFilter) && " matching your filters"}
          </p>
        </div>

        {/* Tutor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative">
                  <img
                    src={tutor.image}
                    alt={`${tutor.name} profile`}
                    className="w-full h-60 object-cover object-center"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=Tutor';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tutor.monthlyRate}/mo
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{tutor.name}</h2>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(tutor.rating) ? "text-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{tutor.rating} ({tutor.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaGraduationCap className="text-indigo-500 mt-1 mr-2" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Qualifications</p>
                        <p className="text-sm text-gray-600">{tutor.qualifications}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaChalkboard className="text-indigo-500 mt-1 mr-2" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Classes</p>
                        <p className="text-sm text-gray-600">
                          {tutor.classes.split(',').map((cls, idx) => (
                            <span 
                              key={idx} 
                              className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1"
                            >
                              {cls.trim() === "College" ? "College" : `Class ${cls.trim()}`}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaBookOpen className="text-indigo-500 mt-1 mr-2" />
                      <div className="w-full">
                        <p className="text-sm font-semibold text-gray-700">Subjects</p>
                        <div className="flex flex-wrap mt-1">
                          {tutor.subjects === "Not specified" ? (
                            <p className="text-sm text-gray-500 italic">No subjects specified</p>
                          ) : (
                            tutor.subjects.split(', ').map((subject, idx) => {
                              // Get color based on subject, or use default gray if not found in mapping
                              const colorClass = subjectColors[subject] || 'bg-gray-100 text-gray-800';
                              
                              return (
                                <span 
                                  key={idx} 
                                  className={`inline-block ${colorClass} rounded-full px-2.5 py-1 text-xs font-medium mr-1.5 mb-1.5`}
                                >
                                  {subject}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link 
                      to={`/tutor-profile/${tutor.id}`} 
                      className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-300"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No tutors found matching your criteria.</p>
              <p className="mt-2 text-gray-500">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
        
        {/* Pagination - For demonstration purposes */}
        {filteredTutors.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 border-t border-b border-gray-300 bg-indigo-50 text-indigo-600">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutors;