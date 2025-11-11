import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getApiUrl } from "../services/api";

const TutorProfileSetupNew = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Step 1: Basic Profile
  const [basicProfile, setBasicProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    qualifications: "",
    bio: "",
    profilePicture: null,
  });

  // Step 2: Tutor Type Selection
  const [tutorType, setTutorType] = useState(""); // 'home', 'center', or 'both'

  // Step 3: Home Tuition Details
  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Business Studies",
    "Accountancy",
    "Political Science",
    "Psychology",
    "Sociology",
    "Physical Education",
    "Art",
    "Music",
  ];

  const availableClasses = [
    "Pre-Primary",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
    "Bachelors (UG)",
    "Masters (PG)",
  ];

  const [homeTuition, setHomeTuition] = useState({
    subjects: [],
    classes: [],
    monthlyRate: "",
    availableTimeSlots: [],
  });

  const [timeSlot, setTimeSlot] = useState("");

  // Step 4: Local Tuition Center Details
  const [centerDetails, setCenterDetails] = useState({
    centerName: "",
    centerAddress: "",
    centerClasses: [],
  });

  // UI state for dropdowns
  const [subjectSearchTerm, setSubjectSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // Load current user data
  useEffect(() => {
    if (currentUser) {
      setBasicProfile((prev) => ({
        ...prev,
        name: currentUser.name || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
      }));
    }
  }, [currentUser]);

  // Handle basic profile changes
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBasicProfile((prev) => ({ ...prev, profilePicture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Subject selection handlers
  const toggleSubject = (subject) => {
    setHomeTuition((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  // Class selection handlers
  const toggleClass = (classItem) => {
    setHomeTuition((prev) => ({
      ...prev,
      classes: prev.classes.includes(classItem)
        ? prev.classes.filter((c) => c !== classItem)
        : [...prev.classes, classItem],
    }));
  };

  // Add time slot
  const addTimeSlot = () => {
    if (timeSlot.trim()) {
      setHomeTuition((prev) => ({
        ...prev,
        availableTimeSlots: [...prev.availableTimeSlots, timeSlot],
      }));
      setTimeSlot("");
    }
  };

  // Remove time slot
  const removeTimeSlot = (index) => {
    setHomeTuition((prev) => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index),
    }));
  };

  // Add center class
  const addCenterClass = () => {
    setCenterDetails((prev) => ({
      ...prev,
      centerClasses: [
        ...prev.centerClasses,
        { day: "", time: "", subject: "", capacity: "" },
      ],
    }));
  };

  // Remove center class
  const removeCenterClass = (index) => {
    setCenterDetails((prev) => ({
      ...prev,
      centerClasses: prev.centerClasses.filter((_, i) => i !== index),
    }));
  };

  // Update center class
  const updateCenterClass = (index, field, value) => {
    setCenterDetails((prev) => {
      const updated = [...prev.centerClasses];
      updated[index][field] = value;
      return { ...prev, centerClasses: updated };
    });
  };

  // Filter subjects and classes
  const filteredSubjects = availableSubjects.filter((subject) =>
    subject.toLowerCase().includes(subjectSearchTerm.toLowerCase())
  );

  const filteredClasses = availableClasses.filter((classItem) =>
    classItem.toLowerCase().includes(classSearchTerm.toLowerCase())
  );

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate basic profile
      if (!basicProfile.qualifications || !basicProfile.bio) {
        setError("Please fill in all required fields");
        return;
      }
    }
    if (currentStep === 2) {
      // Validate tutor type selection
      if (!tutorType) {
        setError("Please select your tutor type");
        return;
      }
    }
    setError("");
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => prev - 1);
  };

  const skipStep = () => {
    setError("");
    setCurrentStep((prev) => prev + 1);
  };

  // Submit profile
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // Upload profile picture if exists
      let profilePictureUrl = "";
      if (basicProfile.profilePicture) {
        const imageData = new FormData();
        imageData.append("file", basicProfile.profilePicture);
        imageData.append("upload_preset", "tutor_finder");

        try {
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/tutorfinder/image/upload",
            {
              method: "POST",
              body: imageData,
            }
          );

          if (response.ok) {
            const data = await response.json();
            profilePictureUrl = data.secure_url;
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }

      // Prepare data based on tutor type
      const profileData = {
        qualifications: basicProfile.qualifications,
        bio: basicProfile.bio,
        phoneNumber: basicProfile.phoneNumber,
        whatsappNumber: basicProfile.whatsappNumber,
        profilePicture: profilePictureUrl,
        tutorType: tutorType,
      };

      // Add home tuition data if applicable
      if (tutorType === "home" || tutorType === "both") {
        profileData.subjects = homeTuition.subjects;
        profileData.classes = homeTuition.classes.join(", ");
        profileData.monthlyRate = Number(homeTuition.monthlyRate);
        profileData.availableTimeSlots = homeTuition.availableTimeSlots;
      }

      // Add center data if applicable
      if (tutorType === "center" || tutorType === "both") {
        profileData.centerName = centerDetails.centerName;
        profileData.centerAddress = centerDetails.centerAddress;
        profileData.centerClasses = centerDetails.centerClasses;
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        getApiUrl("/api/tutors/profile"),
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/tutor-dashboard");
      }
    } catch (err) {
      console.error("Profile setup error:", err);
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Basic Profile Information
              </h2>
              <p className="text-gray-600">
                Let's start with your basic information
              </p>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white"
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
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all">
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Upload your profile picture
              </p>
            </div>

            {/* Name (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={basicProfile.name}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={basicProfile.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={basicProfile.phoneNumber}
                onChange={handleBasicChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                value={basicProfile.whatsappNumber}
                onChange={handleBasicChange}
                placeholder="Enter WhatsApp number"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications *
              </label>
              <input
                type="text"
                name="qualifications"
                value={basicProfile.qualifications}
                onChange={handleBasicChange}
                placeholder="e.g., B.Ed, M.Sc in Physics"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / About Yourself *
              </label>
              <textarea
                name="bio"
                value={basicProfile.bio}
                onChange={handleBasicChange}
                placeholder="Tell students about your teaching experience and approach..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Choose Your Tutor Type
              </h2>
              <p className="text-gray-600">
                Select how you want to provide tutoring services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Home Tuition */}
              <button
                type="button"
                onClick={() => setTutorType("home")}
                className={`p-6 rounded-2xl border-3 transition-all duration-200 ${
                  tutorType === "home"
                    ? "border-purple-500 bg-purple-50 shadow-xl scale-105"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-full ${
                      tutorType === "home" ? "bg-purple-600" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-12 h-12 ${
                        tutorType === "home" ? "text-white" : "text-gray-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Home Tuition
                    </h3>
                    <p className="text-sm text-gray-600">
                      Teach students at their homes
                    </p>
                  </div>
                  {tutorType === "home" && (
                    <div className="flex items-center gap-2 text-purple-600 font-semibold">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              </button>

              {/* Local Tuition Center */}
              <button
                type="button"
                onClick={() => setTutorType("center")}
                className={`p-6 rounded-2xl border-3 transition-all duration-200 ${
                  tutorType === "center"
                    ? "border-indigo-500 bg-indigo-50 shadow-xl scale-105"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-full ${
                      tutorType === "center" ? "bg-indigo-600" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-12 h-12 ${
                        tutorType === "center" ? "text-white" : "text-gray-600"
                      }`}
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
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Tuition Center
                    </h3>
                    <p className="text-sm text-gray-600">
                      Run a local tuition center
                    </p>
                  </div>
                  {tutorType === "center" && (
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              </button>

              {/* Both */}
              <button
                type="button"
                onClick={() => setTutorType("both")}
                className={`p-6 rounded-2xl border-3 transition-all duration-200 ${
                  tutorType === "both"
                    ? "border-pink-500 bg-pink-50 shadow-xl scale-105"
                    : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-full ${
                      tutorType === "both" ? "bg-pink-600" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-12 h-12 ${
                        tutorType === "both" ? "text-white" : "text-gray-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Both Options
                    </h3>
                    <p className="text-sm text-gray-600">
                      Offer both home & center tuition
                    </p>
                  </div>
                  {tutorType === "both" && (
                    <div className="flex items-center gap-2 text-pink-600 font-semibold">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        );

      case 3:
        if (tutorType === "home" || tutorType === "both") {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Home Tuition Details
                </h2>
                <p className="text-gray-600">
                  Provide information about your home tuition services
                </p>
              </div>

              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects You Teach *
                </label>
                <div className="relative subject-field">
                  <input
                    type="text"
                    value={subjectSearchTerm}
                    onChange={(e) => {
                      setSubjectSearchTerm(e.target.value);
                      setShowSubjectDropdown(true);
                    }}
                    onFocus={() => setShowSubjectDropdown(true)}
                    placeholder="Search subjects..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                  {showSubjectDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto subject-dropdown">
                      {filteredSubjects.map((subject) => (
                        <div
                          key={subject}
                          onClick={() => {
                            toggleSubject(subject);
                            setSubjectSearchTerm("");
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            homeTuition.subjects.includes(subject)
                              ? "bg-purple-100 text-purple-800"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{subject}</span>
                            {homeTuition.subjects.includes(subject) && (
                              <svg
                                className="w-5 h-5 text-purple-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {homeTuition.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {homeTuition.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className="hover:text-purple-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
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
                )}
              </div>

              {/* Classes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classes / Grades You Teach *
                </label>
                <div className="relative class-field">
                  <input
                    type="text"
                    value={classSearchTerm}
                    onChange={(e) => {
                      setClassSearchTerm(e.target.value);
                      setShowClassDropdown(true);
                    }}
                    onFocus={() => setShowClassDropdown(true)}
                    placeholder="Search classes..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                  {showClassDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto class-dropdown">
                      {filteredClasses.map((classItem) => (
                        <div
                          key={classItem}
                          onClick={() => {
                            toggleClass(classItem);
                            setClassSearchTerm("");
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            homeTuition.classes.includes(classItem)
                              ? "bg-purple-100 text-purple-800"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{classItem}</span>
                            {homeTuition.classes.includes(classItem) && (
                              <svg
                                className="w-5 h-5 text-purple-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {homeTuition.classes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {homeTuition.classes.map((classItem) => (
                      <span
                        key={classItem}
                        className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {classItem}
                        <button
                          type="button"
                          onClick={() => toggleClass(classItem)}
                          className="hover:text-green-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
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
                )}
              </div>

              {/* Monthly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rate (₹) *
                </label>
                <input
                  type="number"
                  value={homeTuition.monthlyRate}
                  onChange={(e) =>
                    setHomeTuition((prev) => ({
                      ...prev,
                      monthlyRate: e.target.value,
                    }))
                  }
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="e.g., Monday 5-6 PM"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTimeSlot();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all"
                  >
                    Add
                  </button>
                </div>
                {homeTuition.availableTimeSlots.length > 0 && (
                  <div className="space-y-2">
                    {homeTuition.availableTimeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-xl"
                      >
                        <span className="text-blue-800">{slot}</span>
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        } else if (tutorType === "center") {
          // If tutor selected "center" only, show center details in step 3
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Local Tuition Center Details
                </h2>
                <p className="text-gray-600">
                  Provide information about your tuition center
                </p>
              </div>

              {/* Center Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Name *
                </label>
                <input
                  type="text"
                  value={centerDetails.centerName}
                  onChange={(e) =>
                    setCenterDetails((prev) => ({
                      ...prev,
                      centerName: e.target.value,
                    }))
                  }
                  placeholder="e.g., Bright Future Tuition Center"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              {/* Center Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Address / Location *
                </label>
                <textarea
                  value={centerDetails.centerAddress}
                  onChange={(e) =>
                    setCenterDetails((prev) => ({
                      ...prev,
                      centerAddress: e.target.value,
                    }))
                  }
                  placeholder="Enter full address with landmarks"
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              {/* Class Schedule */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Class Schedule
                  </label>
                  <button
                    type="button"
                    onClick={addCenterClass}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Class
                  </button>
                </div>

                {centerDetails.centerClasses.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-3"
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
                    <p className="text-gray-500">
                      No class schedules added yet. Click "Add Class" to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {centerDetails.centerClasses.map((classItem, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-800">
                            Class {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeCenterClass(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Day
                            </label>
                            <select
                              value={classItem.day}
                              onChange={(e) =>
                                updateCenterClass(index, "day", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            >
                              <option value="">Select day</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Time
                            </label>
                            <input
                              type="time"
                              value={classItem.time}
                              onChange={(e) =>
                                updateCenterClass(index, "time", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Subject
                            </label>
                            <input
                              type="text"
                              value={classItem.subject}
                              onChange={(e) =>
                                updateCenterClass(
                                  index,
                                  "subject",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Mathematics"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Capacity
                            </label>
                            <input
                              type="number"
                              value={classItem.capacity}
                              onChange={(e) =>
                                updateCenterClass(
                                  index,
                                  "capacity",
                                  e.target.value
                                )
                              }
                              placeholder="Max students"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }
        break;

      case 4:
        if (tutorType === "center" || tutorType === "both") {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Local Tuition Center Details
                </h2>
                <p className="text-gray-600">
                  Provide information about your tuition center
                </p>
              </div>

              {/* Center Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Name *
                </label>
                <input
                  type="text"
                  value={centerDetails.centerName}
                  onChange={(e) =>
                    setCenterDetails((prev) => ({
                      ...prev,
                      centerName: e.target.value,
                    }))
                  }
                  placeholder="e.g., Bright Future Tuition Center"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              {/* Center Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Address / Location *
                </label>
                <textarea
                  value={centerDetails.centerAddress}
                  onChange={(e) =>
                    setCenterDetails((prev) => ({
                      ...prev,
                      centerAddress: e.target.value,
                    }))
                  }
                  placeholder="Enter full address with landmarks"
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              {/* Class Schedule */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Class Schedule
                  </label>
                  <button
                    type="button"
                    onClick={addCenterClass}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Class
                  </button>
                </div>

                {centerDetails.centerClasses.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-3"
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
                    <p className="text-gray-500">
                      No class schedules added yet. Click "Add Class" to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {centerDetails.centerClasses.map((classItem, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-800">
                            Class {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeCenterClass(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Day
                            </label>
                            <select
                              value={classItem.day}
                              onChange={(e) =>
                                updateCenterClass(index, "day", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            >
                              <option value="">Select day</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Time
                            </label>
                            <input
                              type="time"
                              value={classItem.time}
                              onChange={(e) =>
                                updateCenterClass(index, "time", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Subject
                            </label>
                            <input
                              type="text"
                              value={classItem.subject}
                              onChange={(e) =>
                                updateCenterClass(
                                  index,
                                  "subject",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Mathematics"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Capacity
                            </label>
                            <input
                              type="number"
                              value={classItem.capacity}
                              onChange={(e) =>
                                updateCenterClass(
                                  index,
                                  "capacity",
                                  e.target.value
                                )
                              }
                              placeholder="Max students"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }
        break;

      default:
        return null;
    }
  };

  const getTotalSteps = () => {
    if (tutorType === "both") return 4;
    if (tutorType === "home" || tutorType === "center") return 3;
    return 2;
  };

  const shouldShowNextButton = () => {
    if (currentStep === 2) return true; // Always show next after selecting tutor type
    if (currentStep === 3 && tutorType === "center") return false; // Center-only submits on step 3
    if (currentStep === 3 && tutorType === "home") return false; // Home-only submits on step 3
    if (currentStep === 3 && tutorType === "both") return true; // Both types proceed to step 4
    if (currentStep === 4 && tutorType === "both") return false; // Both types submit on step 4
    return currentStep < getTotalSteps();
  };

  const shouldShowSubmitButton = () => {
    if (tutorType === "home" && currentStep === 3) return true;
    if (tutorType === "center" && currentStep === 3) return true; // Center-only submits on step 3
    if (tutorType === "both" && currentStep === 4) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, tutorType ? 3 : null, tutorType === "both" ? 4 : null]
              .filter(Boolean)
              .map((step, index, array) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        step <= currentStep
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    <span className="text-xs text-gray-600 mt-2 text-center">
                      {step === 1 && "Basic Info"}
                      {step === 2 && "Tutor Type"}
                      {step === 3 &&
                        (tutorType === "home" || tutorType === "both") &&
                        "Home Tuition"}
                      {step === 3 && tutorType === "center" && "Center Details"}
                      {step === 4 && "Center Details"}
                    </span>
                  </div>
                  {index < array.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-all ${
                        step < currentStep
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep > 2 && !shouldShowSubmitButton() && (
                <button
                  type="button"
                  onClick={skipStep}
                  className="px-6 py-3 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                >
                  Skip
                </button>
              )}

              {shouldShowNextButton() && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all flex items-center gap-2 shadow-lg"
                >
                  Next
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {shouldShowSubmitButton() && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Complete Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfileSetupNew;
