import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getApiUrl } from "../services/api";


const EditTutorProfile = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);

  // Predefined lists of subjects and classes
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualifications: "",
    bio: "",
    subjects: [],
    classes: [],
    location: "",
    monthlyRate: "", // Changed from hourlyRate to monthlyRate
    availableTimeSlots: [],
    phoneNumber: "",
    whatsappNumber: "",
    whatsappSameAsPhone: false,
    tutorType: "home", // 'home', 'center', or 'both'
    centerName: "",
    centerAddress: "",
    centerClasses: [], // Array of {day, time, subject, capacity}
  });

  // For managing dropdown UI state
  const [subjectSearchTerm, setSubjectSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");

  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubjectDropdown || showClassDropdown) {
        // Check if the click is outside the dropdowns
        if (
          !event.target.closest(".subject-dropdown") &&
          !event.target.closest(".subject-field")
        ) {
          setShowSubjectDropdown(false);
        }
        if (
          !event.target.closest(".class-dropdown") &&
          !event.target.closest(".class-field")
        ) {

          setShowClassDropdown(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);

    };
  }, [showSubjectDropdown, showClassDropdown]);

  // Load current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser || currentUser.role !== "tutor") {
        navigate("/login");

        return;
      }

      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log(
          "Fetching profile with token:",
          token ? `${token.substring(0, 10)}...` : "No token"
        );

        const response = await axios.get(getApiUrl("/api/tutors/my-profile"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Profile fetch response:", response.data);

        if (response.data.success) {
          const profile = response.data.data;

          console.log("Profile data received:", profile);

          // Ensure classes is an array for consistency
          const classesArray =
            typeof profile.classes === "string"
              ? profile.classes.split(",").map((c) => c.trim())
              : Array.isArray(profile.classes)
              ? profile.classes
              : [];

          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            qualifications: profile.qualifications || "",
            bio: profile.bio || "",
            subjects: Array.isArray(profile.subjects) ? profile.subjects : [],
            classes: classesArray,
            location: profile.location || "",
            monthlyRate: profile.monthlyRate || "", // Changed from hourlyRate to monthlyRate
            availableTimeSlots: Array.isArray(profile.availableTimeSlots)
              ? profile.availableTimeSlots
              : [],
            phoneNumber: profile.phoneNumber || "",
            whatsappNumber: profile.whatsappNumber || "",
            tutorType: profile.tutorType || "home",
            centerName: profile.centerName || "",
            centerAddress: profile.centerAddress || "",
            centerClasses: Array.isArray(profile.centerClasses)
              ? profile.centerClasses
              : [],
          });

          // Set the checkbox state based on whether numbers match
          if (
            profile.phoneNumber &&
            profile.whatsappNumber &&
            profile.phoneNumber === profile.whatsappNumber
          ) {
            setWhatsappSameAsPhone(true);
          }


          if (profile.profilePicture) {
            setImagePreview(profile.profilePicture);
          }
        } else {
          setError(
            "Failed to load profile data: " +
              (response.data.message || "Unknown error")
          );
        }
      } catch (err) {
        console.error("Error fetching profile:", err);

        // Log more details about the error
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load profile data. Please try again."

        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,

    }));
  };

  // Subject selection handlers
  const toggleSubject = (subject) => {
    setFormData((prevState) => {
      if (prevState.subjects.includes(subject)) {
        return {
          ...prevState,
          subjects: prevState.subjects.filter((s) => s !== subject),

        };
      } else {
        return {
          ...prevState,
          subjects: [...prevState.subjects, subject],

        };
      }
    });
  };

  // Class selection handlers
  const toggleClass = (classItem) => {
    setFormData((prevState) => {
      const currentClasses = Array.isArray(prevState.classes)
        ? prevState.classes
        : [];

      if (currentClasses.includes(classItem)) {
        return {
          ...prevState,
          classes: currentClasses.filter((c) => c !== classItem),

        };
      } else {
        return {
          ...prevState,
          classes: [...currentClasses, classItem],

        };
      }
    });
  };

  // Filter subjects based on search term
  const filteredSubjects = availableSubjects.filter((subject) =>
    subject.toLowerCase().includes(subjectSearchTerm.toLowerCase())
  );

  // Filter classes based on search term
  const filteredClasses = availableClasses.filter((classItem) =>

    classItem.toLowerCase().includes(classSearchTerm.toLowerCase())
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaveLoading(true);

    try {
      const token = localStorage.getItem("token");

      let profilePictureUrl = imagePreview;

      // Upload image if a new one was selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);
        formData.append("upload_preset", "tutor_finder"); // Your Cloudinary upload preset

        try {
          console.log("Uploading new profile image...");
          // Use a simple fetch for Cloudinary upload
          const uploadResponse = await fetch(
            "https://api.cloudinary.com/v1_1/tutorfinder/image/upload",
            {
              method: "POST",

              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            throw new Error("Image upload failed");

          }

          const uploadData = await uploadResponse.json();
          profilePictureUrl = uploadData.secure_url;
          console.log("New image uploaded successfully:", profilePictureUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setError("Failed to upload profile image. Profile update continued.");

          // Continue with the profile update even if image upload fails
        }
      }

      // Validate classes and subjects
      if (formData.subjects.length === 0) {
        setError("Please select at least one subject");

        setSaveLoading(false);
        return;
      }

      if (formData.classes.length === 0) {
        setError("Please select at least one class");

        setSaveLoading(false);
        return;
      }

      // Validate center details if tutor type is center or both
      if (formData.tutorType === "center" || formData.tutorType === "both") {
        if (!formData.centerName || !formData.centerAddress) {
          setError("Please fill in center name and address for center tutors");
          setSaveLoading(false);
          return;
        }
      }


      // Update profile data
      const profileData = {
        ...formData,
        profilePicture: profilePictureUrl,
        classes: Array.isArray(formData.classes)
          ? formData.classes.join(", ")
          : formData.classes,
        // Ensure monthlyRate is sent as integer to avoid precision issues
        monthlyRate: parseInt(formData.monthlyRate, 10) || 0,
        // Ensure availableTimeSlots is included
        availableTimeSlots: formData.availableTimeSlots || [],
        // Include tutor type and center details
        tutorType: formData.tutorType,
        centerName: formData.centerName || "",
        centerAddress: formData.centerAddress || "",
        centerClasses: formData.centerClasses || [],
      };

      console.log(
        "Original monthlyRate:",
        formData.monthlyRate,
        typeof formData.monthlyRate
      );
      console.log(
        "Converted monthlyRate:",
        profileData.monthlyRate,
        typeof profileData.monthlyRate
      );
      console.log("Updating profile with data:", profileData);

      const updateResponse = await axios.put(
        getApiUrl("/api/tutors/profile"),

        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile update response:", updateResponse.data);

      if (updateResponse.data.success) {
        setSuccess("Profile updated successfully!");


        // Update the current user in auth context if it exists
        if (updateCurrentUser) {
          updateCurrentUser({
            ...currentUser,
            ...updateResponse.data.data,
          });
        }

        // Scroll to top to show success message
        window.scrollTo(0, 0);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );

    } finally {
      setSaveLoading(false);
    }
  };

  // Remove the timeSlots and daysOfWeek arrays

  const handleWhatsappCheckbox = (e) => {
    const isChecked = e.target.checked;
    setWhatsappSameAsPhone(isChecked);

    if (isChecked) {
      // If checked, set WhatsApp number to phone number
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: prev.phoneNumber,

      }));
    }
  };

  useEffect(() => {
    if (whatsappSameAsPhone) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: prev.phoneNumber,

      }));
    }
  }, [formData.phoneNumber, whatsappSameAsPhone]);

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
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Edit Your Profile
          </h1>


          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}


          {success && (
            <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Profile Picture
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"

                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <svg
                        className="w-16 h-16 mb-2"
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
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a professional profile photo. A good profile picture
                    can help you connect with more students.

                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                  />
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="name"
                  >

                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none cursor-not-allowed"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Name cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="email"
                  >

                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none cursor-not-allowed"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Add Phone Number Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="phoneNumber"
                  >

                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. +91 9876543210"
                    required
                  />
                </div>

                {/* Add WhatsApp Number Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="whatsappNumber"
                  >

                    WhatsApp Number
                  </label>
                  <div className="space-y-2">
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                        whatsappSameAsPhone ? "bg-gray-100" : ""
                      }`}

                      placeholder="e.g. +91 9876543210"
                      disabled={whatsappSameAsPhone}
                      required
                    />
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="whatsappSameAsPhone"
                        checked={whatsappSameAsPhone}
                        onChange={handleWhatsappCheckbox}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="whatsappSameAsPhone"
                        className="ml-2 text-xs text-gray-700"
                      >

                        Same as phone number
                      </label>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="bio"
                  >

                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell students about yourself, your teaching philosophy, and experience..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Tutor Type Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tutor Type
              </h2>
              <p className="text-gray-600 mb-6">
                Choose the type of tutoring services you provide
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Home Tutor Card */}
                <div
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, tutorType: "home" }))
                  }
                  className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                    formData.tutorType === "home"
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏠</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Home Tutor
                    </h3>
                    <p className="text-sm text-gray-600">
                      Provide one-on-one tutoring at student's home
                    </p>
                    {formData.tutorType === "home" && (
                      <div className="mt-3 text-indigo-600 font-medium flex items-center justify-center gap-1">
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
                </div>

                {/* Center Tutor Card */}
                <div
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, tutorType: "center" }))
                  }
                  className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                    formData.tutorType === "center"
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏫</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Center Tutor
                    </h3>
                    <p className="text-sm text-gray-600">
                      Teach at your tuition center or coaching institute
                    </p>
                    {formData.tutorType === "center" && (
                      <div className="mt-3 text-indigo-600 font-medium flex items-center justify-center gap-1">
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
                </div>

                {/* Both Card */}
                <div
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, tutorType: "both" }))
                  }
                  className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                    formData.tutorType === "both"
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏠🏫</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Both
                    </h3>
                    <p className="text-sm text-gray-600">
                      Offer both home tutoring and center classes
                    </p>
                    {formData.tutorType === "both" && (
                      <div className="mt-3 text-indigo-600 font-medium flex items-center justify-center gap-1">
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
                </div>
              </div>
            </div>

            {/* Teaching Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Teaching Details
              </h2>


              <div className="grid grid-cols-1 gap-6">
                {/* Subjects Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects
                  </label>
                  <div className="relative">
                    <div
                      className="w-full p-2 border rounded flex flex-wrap gap-2 cursor-pointer min-h-[42px] subject-field"
                      onClick={() => setShowSubjectDropdown(true)}
                    >
                      {(!formData.subjects ||
                        formData.subjects.length === 0) && (
                        <span className="text-gray-400">
                          Select subjects you can teach
                        </span>
                      )}
                      {formData.subjects &&
                        formData.subjects.map((subject) => (
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
                              <svg
                                className="w-3 h-3"
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


                    {showSubjectDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto subject-dropdown">
                        <div className="p-2 border-b sticky top-0 bg-white">
                          <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Search subjects..."
                            value={subjectSearchTerm}
                            onChange={(e) =>
                              setSubjectSearchTerm(e.target.value)
                            }

                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subject) => (
                              <div
                                key={subject}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                                  formData.subjects.includes(subject)
                                    ? "bg-indigo-50"
                                    : ""

                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubject(subject);
                                }}
                              >
                                <div
                                  className={`w-4 h-4 mr-2 border rounded ${
                                    formData.subjects.includes(subject)
                                      ? "bg-indigo-500 border-indigo-500"
                                      : "border-gray-400"
                                  }`}
                                >
                                  {formData.subjects.includes(subject) && (
                                    <svg
                                      className="w-4 h-4 text-white"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />

                                    </svg>
                                  )}
                                </div>
                                {subject}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No subjects found
                            </div>

                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {(!formData.subjects || formData.subjects.length === 0) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select at least one subject
                    </p>
                  )}
                </div>


                {/* Classes Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classes/Grades
                  </label>
                  <div className="relative">
                    <div

                      className="w-full p-2 border rounded flex flex-wrap gap-2 cursor-pointer min-h-[42px] class-field"
                      onClick={() => setShowClassDropdown(true)}
                    >
                      {(!formData.classes || formData.classes.length === 0) && (
                        <span className="text-gray-400">
                          Select classes you can teach
                        </span>
                      )}
                      {formData.classes &&
                        formData.classes.map((classItem) => (
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
                              <svg
                                className="w-3 h-3"
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
                            filteredClasses.map((classItem) => (
                              <div
                                key={classItem}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                                  formData.classes.includes(classItem)
                                    ? "bg-green-50"
                                    : ""

                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleClass(classItem);
                                }}
                              >
                                <div
                                  className={`w-4 h-4 mr-2 border rounded ${
                                    formData.classes.includes(classItem)
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-400"
                                  }`}
                                >
                                  {formData.classes.includes(classItem) && (
                                    <svg
                                      className="w-4 h-4 text-white"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />

                                    </svg>
                                  )}
                                </div>
                                {classItem}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              No classes found
                            </div>

                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {(!formData.classes || formData.classes.length === 0) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select at least one class
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="qualifications"
                  >

                    Qualifications
                  </label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. M.Sc. Mathematics, B.Ed."
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Delhi, Mumbai, Bangalore"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Enter your city or area to help parents find you
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="monthlyRate"
                  >

                    Monthly Rate (₹)
                  </label>
                  <input
                    type="number"
                    id="monthlyRate"
                    name="monthlyRate"
                    value={formData.monthlyRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 2000"
                    min="0"
                    step="1"

                    required
                  />
                </div>
              </div>
            </div>

            {/* Availability Section - Only for home tutors */}
            {(formData.tutorType === "home" ||
              formData.tutorType === "both") && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🏠 Home Tuition Availability
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Add your available time slots for home tutoring sessions.
                </p>

                <div className="space-y-4">
                  {/* Display current time slots */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Time Slots
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.availableTimeSlots &&
                      formData.availableTimeSlots.length > 0 ? (
                        formData.availableTimeSlots.map((slot, index) => (
                          <div
                            key={index}
                            className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            {slot}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  availableTimeSlots:
                                    prev.availableTimeSlots.filter(
                                      (_, i) => i !== index
                                    ),
                                }));
                              }}
                              className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
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
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No time slots added yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Add new time slot */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const startTime =
                        document.getElementById("startTime").value;
                      const endTime = document.getElementById("endTime").value;

                      if (startTime && endTime) {
                        // Format time from 24h to 12h format with AM/PM
                        const formatTime = (timeStr) => {
                          const [hours, minutes] = timeStr.split(":");
                          const period = hours >= 12 ? "PM" : "AM";
                          const hour12 = hours % 12 || 12;
                          return `${hour12}:${minutes} ${period}`;
                        };

                        const newSlot = `${formatTime(
                          startTime
                        )} - ${formatTime(endTime)}`;

                        setFormData((prev) => ({
                          ...prev,
                          availableTimeSlots: Array.isArray(
                            prev.availableTimeSlots
                          )
                            ? [...prev.availableTimeSlots, newSlot]
                            : [newSlot],
                        }));

                        // Clear inputs
                        document.getElementById("startTime").value = "";
                        document.getElementById("endTime").value = "";
                      }
                    }}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition duration-200"
                  >
                    Add Time Slot
                  </button>
                </div>
              </div>
            )}

            {/* Center Details Section - Only show if tutorType is 'center' or 'both' */}
            {(formData.tutorType === "center" ||
              formData.tutorType === "both") && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  🏫 Tuition Center Details
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Provide information about your tuition center or coaching
                  institute.
                </p>

                <div className="space-y-6">
                  {/* Center Name */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="centerName"
                    >
                      Center Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="centerName"
                      name="centerName"
                      value={formData.centerName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Excel Coaching Classes"
                      required={
                        formData.tutorType === "center" ||
                        formData.tutorType === "both"
                      }
                    />
                  </div>

                  {/* Center Address */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="centerAddress"
                    >
                      Center Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="centerAddress"
                      name="centerAddress"
                      value={formData.centerAddress}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter complete address of your tuition center"
                      required={
                        formData.tutorType === "center" ||
                        formData.tutorType === "both"
                      }
                    ></textarea>
                  </div>

                  {/* Center Classes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Schedule
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Add classes that you conduct at your center
                    </p>

                    {/* Display existing classes */}
                    {formData.centerClasses &&
                      formData.centerClasses.length > 0 && (
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {formData.centerClasses.map((classItem, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                                      {classItem.day}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {classItem.time}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium text-gray-800">
                                    {classItem.subject}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Capacity: {classItem.capacity} students
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      centerClasses: prev.centerClasses.filter(
                                        (_, i) => i !== index
                                      ),
                                    }));
                                  }}
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
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Add new class form */}
                    <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Add New Class
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Day
                          </label>
                          <select
                            id="classDay"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Time
                          </label>
                          <input
                            type="text"
                            id="classTime"
                            placeholder="e.g. 10:00 AM - 11:30 AM"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Subject
                          </label>
                          <input
                            type="text"
                            id="classSubject"
                            placeholder="e.g. Mathematics"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            id="classCapacity"
                            placeholder="e.g. 20"
                            min="1"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const day = document.getElementById("classDay").value;
                          const time =
                            document.getElementById("classTime").value;
                          const subject =
                            document.getElementById("classSubject").value;
                          const capacity =
                            document.getElementById("classCapacity").value;

                          if (day && time && subject && capacity) {
                            const newClass = {
                              day,
                              time,
                              subject,
                              capacity: parseInt(capacity),
                            };

                            setFormData((prev) => ({
                              ...prev,
                              centerClasses: Array.isArray(prev.centerClasses)
                                ? [...prev.centerClasses, newClass]
                                : [newClass],
                            }));

                            // Clear inputs
                            document.getElementById("classDay").value = "";
                            document.getElementById("classTime").value = "";
                            document.getElementById("classSubject").value = "";
                            document.getElementById("classCapacity").value = "";
                          } else {
                            alert("Please fill in all fields to add a class");
                          }
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm transition duration-200"
                      >
                        + Add Class
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/tutor-dashboard")}

                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition duration-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saveLoading ||
                  formData.subjects?.length === 0 ||
                  formData.classes?.length === 0
                }
                className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition duration-200 ${
                  saveLoading ||
                  formData.subjects?.length === 0 ||
                  formData.classes?.length === 0
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {saveLoading ? "Saving..." : "Save Changes"}

              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTutorProfile;

