import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaStar,
  FaFilter,
  FaGraduationCap,
  FaBookOpen,
  FaChalkboard,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { getApiUrl } from "../services/api";

// Utility function to normalize text to simple English
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .normalize("NFD") // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[āăâäàáåãæēĕėęěêëèéīĭîïìíōŏôöòóøõūŭûüùúÿýñçĉćč]/gi, (match) => {
      // Replace special characters with simple English equivalents
      const map = {
        ā: "a",
        ă: "a",
        â: "a",
        ä: "a",
        à: "a",
        á: "a",
        å: "a",
        ã: "a",
        æ: "ae",
        ē: "e",
        ĕ: "e",
        ė: "e",
        ę: "e",
        ě: "e",
        ê: "e",
        ë: "e",
        è: "e",
        é: "e",
        ī: "i",
        ĭ: "i",
        î: "i",
        ï: "i",
        ì: "i",
        í: "i",
        ō: "o",
        ŏ: "o",
        ô: "o",
        ö: "o",
        ò: "o",
        ó: "o",
        ø: "o",
        õ: "o",
        ū: "u",
        ŭ: "u",
        û: "u",
        ü: "u",
        ù: "u",
        ú: "u",
        ÿ: "y",
        ý: "y",
        ñ: "n",
        ç: "c",
        ĉ: "c",
        ć: "c",
        č: "c",
      };
      return map[match.toLowerCase()] || match;
    })
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove any remaining special characters
    .trim();
};

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

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Cities API states
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);


  // Fetch tutors from API
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getApiUrl("/api/tutors"));

        if (response.data.success) {
          // Format the tutor data for display
          const formattedTutors = response.data.data.map((tutor) => {
            // Handle classes - it could be a string, array, or empty
            let formattedClasses = "Not specified";
            if (tutor.classes) {
              if (Array.isArray(tutor.classes)) {
                formattedClasses = tutor.classes.join(", ");
              } else if (
                typeof tutor.classes === "string" &&
                tutor.classes.trim() !== ""
              ) {
                formattedClasses = tutor.classes;
              }
            }

            // Handle subjects - it could be an array or string
            let formattedSubjects = "Not specified";
            if (tutor.subjects) {
              if (Array.isArray(tutor.subjects) && tutor.subjects.length > 0) {
                formattedSubjects = tutor.subjects.join(", ");
              } else if (
                typeof tutor.subjects === "string" &&
                tutor.subjects.trim() !== ""
              ) {
                formattedSubjects = tutor.subjects;
              }
            }

            // Filter out invalid blob URLs and use fallback
            const defaultImage =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ETutor%3C/text%3E%3C/svg%3E";
            let tutorImage = defaultImage;

            if (
              tutor.profilePicture &&
              !tutor.profilePicture.startsWith("blob:")
            ) {
              tutorImage = tutor.profilePicture;
            }

            return {
              id: tutor._id,
              name: tutor.name,
              image: tutorImage,
              qualifications: tutor.qualifications || "Not specified",
              classes: formattedClasses,
              subjects: formattedSubjects,
              location: tutor.location || "",
              rating: tutor.rating || 0,
              reviewCount: tutor.reviewCount || 0,
              // Use monthlyRate if available, fall back to hourlyRate for backward compatibility
              monthlyRate: tutor.monthlyRate
                ? `₹${tutor.monthlyRate}`
                : tutor.hourlyRate
                ? `₹${tutor.hourlyRate}`
                : "Not specified",
            };
          });

          setTutors(formattedTutors);
        } else {
          setError("Failed to load tutors");
        }
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError("Failed to load tutors. Please try again.");

      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Fetch cities from India
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            country: "India",
          }
        );

        if (response.data.error === false && response.data.data) {
          // Normalize city names to simple English (remove special characters)
          const normalizedCities = response.data.data
            .map((city) => normalizeText(city))
            .filter((city) => city.length > 0); // Remove empty strings

          // Remove duplicates and sort
          const uniqueCities = [...new Set(normalizedCities)].sort();
          setCities(uniqueCities);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Filter cities based on input
  useEffect(() => {
    if (locationFilter.trim() === "") {
      setFilteredCities([]);
    } else {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(locationFilter.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 10)); // Show only top 10 matches
    }
  }, [locationFilter, cities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".city-dropdown-container")) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city) => {
    setLocationFilter(city);
    setShowCityDropdown(false);
  };

  // Filter tutors based on search term and filters
  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      subjectFilter === "" ||
      tutor.subjects.toLowerCase().includes(subjectFilter.toLowerCase());

    const matchesClass =
      classFilter === "" || tutor.classes.includes(classFilter);

    const matchesLocation =
      locationFilter === "" ||
      (tutor.location &&
        tutor.location.toLowerCase().includes(locationFilter.toLowerCase()));

    return matchesSearch && matchesSubject && matchesClass && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Find Your Perfect Tutor
          </h1>
          <p className="mt-2 text-base sm:text-lg">
            Browse through our qualified tutors and filter by your preferences
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            <FaFilter />
            <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>

          {/* Left Sidebar - Search Options */}
          <div
            className={`${
              showMobileFilters ? "block" : "hidden"
            } lg:block w-full lg:w-80 flex-shrink-0`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter className="text-indigo-600" />
                  Search Filters
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Search by name or subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Name or subject..."
                      className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                {/* Filter by Location */}
                <div className="city-dropdown-container">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-indigo-600" />
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter city or area..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={locationFilter}
                      onChange={handleLocationFilter}
                      onFocus={() => setShowCityDropdown(true)}
                      autoComplete="off"
                    />
                    {/* Cities Dropdown */}
                    {showCityDropdown && filteredCities.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredCities.map((city, index) => (
                          <div
                            key={index}
                            className="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors flex items-center gap-2"
                            onClick={() => handleCitySelect(city)}
                          >
                            <FaMapMarkerAlt className="text-indigo-600 text-sm" />
                            <span className="text-gray-800">{city}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {loadingCities && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Search for tutors in your area
                  </p>
                </div>

                {/* Filter by Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaBookOpen className="inline mr-2 text-indigo-600" />
                    Subject
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    value={subjectFilter}
                    onChange={handleSubjectFilter}
                  >
                    <option value="">All Subjects</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="english">English</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="computer science">Computer Science</option>
                    <option value="programming">Programming</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                    <option value="science">Science</option>
                    <option value="economics">Economics</option>
                  </select>
                </div>

                {/* Filter by Class */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaChalkboard className="inline mr-2 text-indigo-600" />
                    Class/Grade
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                    value={classFilter}
                    onChange={handleClassFilter}
                  >
                    <option value="">All Classes</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="College">College</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSubjectFilter("");
                    setClassFilter("");
                    setLocationFilter("");
                  }}
                  className="w-full px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
                >
                  Clear All Filters
                </button>

                {/* Active Filters Summary */}
                {(searchTerm ||
                  subjectFilter ||
                  classFilter ||
                  locationFilter) && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Active Filters:
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      {searchTerm && <p>• Search: "{searchTerm}"</p>}
                      {locationFilter && <p>• Location: {locationFilter}</p>}
                      {subjectFilter && <p>• Subject: {subjectFilter}</p>}
                      {classFilter && <p>• Class: {classFilter}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Tutors Grid */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-700 text-lg">
                Showing{" "}
                <span className="font-bold text-indigo-600">
                  {filteredTutors.length}
                </span>{" "}
                of {tutors.length} tutors
                {(searchTerm ||
                  subjectFilter ||
                  classFilter ||
                  locationFilter) &&
                  " matching your filters"}
              </p>
            </div>

            {/* Tutor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTutors.length > 0 ? (
                filteredTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative">
                      <img
                        src={tutor.image}
                        alt={`${tutor.name} profile`}
                        className="w-full h-56 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='24' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ETutor%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        {tutor.monthlyRate}/mo
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {tutor.name}
                      </h2>

                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                i < Math.floor(tutor.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {tutor.rating} ({tutor.reviewCount})
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <FaGraduationCap className="text-indigo-500 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              Qualifications
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {tutor.qualifications}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <FaChalkboard className="text-indigo-500 mt-1 mr-2 flex-shrink-0" />
                          <div className="w-full">
                            <p className="text-sm font-semibold text-gray-700">
                              Classes
                            </p>
                            <div className="flex flex-wrap mt-1">
                              {tutor.classes &&
                              typeof tutor.classes === "string" &&
                              tutor.classes.trim() !== "" ? (
                                tutor.classes
                                  .split(",")
                                  .slice(0, 4)
                                  .map((cls, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-1 mb-1"
                                    >
                                      {cls.trim() === "College"
                                        ? "College"
                                        : `Class ${cls.trim()}`}
                                    </span>
                                  ))
                              ) : (
                                <span className="text-xs text-gray-500">
                                  Not specified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <FaBookOpen className="text-indigo-500 mt-1 mr-2 flex-shrink-0" />
                          <div className="w-full">
                            <p className="text-sm font-semibold text-gray-700">
                              Subjects
                            </p>
                            <div className="flex flex-wrap mt-1">
                              {!tutor.subjects ||
                              tutor.subjects === "Not specified" ||
                              typeof tutor.subjects !== "string" ||
                              tutor.subjects.trim() === "" ? (
                                <p className="text-xs text-gray-500 italic">
                                  No subjects specified
                                </p>
                              ) : (
                                tutor.subjects
                                  .split(", ")
                                  .slice(0, 5)
                                  .map((subject, idx) => {
                                    const colorClass =
                                      subjectColors[subject] ||
                                      "bg-gray-100 text-gray-800";

                                    return (
                                      <span
                                        key={idx}
                                        className={`inline-block ${colorClass} rounded-full px-2 py-0.5 text-xs font-medium mr-1 mb-1`}
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
                          className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition duration-300 font-medium shadow-lg hover:shadow-xl"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
                    <FaSearch className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-xl text-gray-600 font-semibold">
                    No tutors found matching your criteria
                  </p>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or search term
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredTutors.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-lg shadow-sm">
                  <button className="px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    Prev
                  </button>
                  <button className="px-4 py-2 border-t border-b border-gray-300 bg-indigo-600 text-white font-semibold">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tutors;

