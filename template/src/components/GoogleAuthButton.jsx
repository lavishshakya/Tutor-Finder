import React from "react";
import { FaGoogle } from "react-icons/fa";
import { getApiUrl } from "../services/api";

const GoogleAuthButton = ({ text = "Continue with Google" }) => {
  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = getApiUrl("/api/auth/google");
  };

  return (
    <button
      onClick={handleGoogleAuth}
      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <FaGoogle className="text-xl text-red-500" />
      <span>{text}</span>
    </button>
  );
};

export default GoogleAuthButton;
