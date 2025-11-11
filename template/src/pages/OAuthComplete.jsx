import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaUser, FaPhone, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { getApiUrl } from "../services/api";

const OAuthComplete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [googleData, setGoogleData] = useState(null);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    role: "",
    whatsappNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam));
        setGoogleData(data);
      } catch (err) {
        console.error("Failed to parse Google data:", err);
        navigate("/login?error=Invalid OAuth data");
      }
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  const handleSendOTP = async () => {
    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!formData.role) {
      setError("Please select your role (Parent or Tutor)");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("Sending OTP to:", formData.phoneNumber);

      // Call backend API to send OTP via Twilio
      const response = await axios.post(getApiUrl("/api/otp/send"), {
        phoneNumber: formData.phoneNumber,
      });

      if (response.data.success) {
        console.log("OTP sent successfully!");
        setOtpSent(true);
        setError("");
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Failed to send OTP:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpVerifying(true);
    setError("");

    try {
      console.log("Verifying OTP...");

      // Call backend API to verify OTP
      const response = await axios.post(getApiUrl("/api/otp/verify"), {
        phoneNumber: formData.phoneNumber,
        otp: otp,
      });

      if (response.data.success) {
        console.log("OTP verified successfully!");
        setPhoneVerified(true);
        setError("");
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      const errorMessage =
        err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneVerified) {
      setError("Please verify your phone number first");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Complete registration
      const response = await axios.post(getApiUrl("/api/auth/oauth-complete"), {
        ...googleData,
        ...formData,
        whatsappNumber: formData.whatsappNumber || formData.phoneNumber,
        phoneVerified: true,
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Update auth context
        login(response.data.user, response.data.token);

        // Redirect based on role
        if (response.data.user.role === "tutor") {
          navigate("/tutor-dashboard");
        } else {
          navigate("/parent-dashboard");
        }
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Complete registration error:", err);
      setError(
        err.response?.data?.message || "Failed to complete registration"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!googleData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          {googleData.profilePicture && (
            <img
              src={googleData.profilePicture}
              alt={googleData.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-purple-200"
            />
          )}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            Welcome, {googleData.name}! Just a few more details...
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "parent" })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.role === "parent"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <div className="font-semibold">Parent</div>
                <div className="text-xs text-gray-500 mt-1">
                  Looking for tutors
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "tutor" })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.role === "tutor"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="font-semibold">Tutor</div>
                <div className="text-xs text-gray-500 mt-1">
                  Offering services
                </div>
              </button>
            </div>
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
                maxLength="10"
                pattern="[0-9]{10}"
                disabled={otpSent || phoneVerified}
              />
              {phoneVerified && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <FaCheckCircle className="text-green-500 text-xl" />
                </div>
              )}
            </div>

            {/* Send OTP Button */}
            {!otpSent && !phoneVerified && (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading || !formData.phoneNumber || !formData.role}
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            {/* OTP Input */}
            {otpSent && !phoneVerified && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit OTP"
                    className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    maxLength="6"
                    pattern="[0-9]{6}"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={otpVerifying || otp.length !== 6}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpVerifying ? "..." : "Verify"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {phoneVerified && (
              <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <FaCheckCircle /> Phone verified successfully!
              </p>
            )}
          </div>

          {/* WhatsApp Number (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number (Optional)
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
                placeholder="Leave empty to use phone number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                maxLength="10"
                pattern="[0-9]{10}|^$"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              !formData.role ||
              !formData.phoneNumber ||
              !phoneVerified
            }
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 ${
              loading ||
              !formData.role ||
              !formData.phoneNumber ||
              !phoneVerified
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating Account...
              </span>
            ) : !phoneVerified ? (
              "Verify Phone Number First"
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OAuthComplete;
