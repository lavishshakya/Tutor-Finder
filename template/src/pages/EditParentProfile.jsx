import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaCamera,
} from "react-icons/fa";
import { getApiUrl } from "../services/api";

const EditParentProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "parent") {
      navigate("/");
      return;
    }

    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(getApiUrl("/api/auth/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const user = response.data.data;
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            whatsappNumber: user.whatsappNumber || "",
          });
          setProfilePicture(user.profilePicture || "");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load profile data");
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just show preview. In production, upload to cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Validate phone number
      if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber)) {
        setError("Please enter a valid 10-digit phone number");
        setLoading(false);
        return;
      }

      // Validate WhatsApp number if provided
      if (
        formData.whatsappNumber &&
        !/^[0-9]{10}$/.test(formData.whatsappNumber)
      ) {
        setError("Please enter a valid 10-digit WhatsApp number");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        getApiUrl("/api/parents/update-profile"),
        {
          ...formData,
          profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Profile updated successfully!");

        // Update local storage
        const userData = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userData,
            name: formData.name,
            email: formData.email,
          })
        );

        setTimeout(() => {
          navigate("/parent-dashboard");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600">Update your personal information</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={
                  profilePicture ||
                  "https://via.placeholder.com/150/cccccc/ffffff?text=No+Image"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-3 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg"
              >
                <FaCamera />
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click camera icon to change photo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 cursor-not-allowed"
                  maxLength="10"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Phone number cannot be changed
              </p>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaWhatsapp className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="10-digit WhatsApp number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  maxLength="10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional - Leave empty to use phone number
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/parent-dashboard")}
                className="px-8 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditParentProfile;
