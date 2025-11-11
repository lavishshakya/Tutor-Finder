<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
=======
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { getApiUrl } from "../services/api";
>>>>>>> 181f83f (Updated Features)

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
<<<<<<< HEAD
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { name, email, password, confirmPassword, role } = formData;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Sending registration data:', { name, email, role });
      
      const response = await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
        role
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on user role
        if (response.data.user.role === 'tutor') {
          navigate('/tutor-profile-setup');
        } else {
          navigate('/parent-dashboard');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
=======
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "parent", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const { name, email, phoneNumber, password, confirmPassword, role } =
    formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Setup reCAPTCHA
  // Send OTP
  const sendOTP = async () => {
    setError("");

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setOtpLoading(true);
      console.log("Sending OTP to:", phoneNumber);

      // Call backend API to send OTP via Twilio
      const response = await axios.post(getApiUrl("/api/otp/send"), {
        phoneNumber: phoneNumber,
      });

      if (response.data.success) {
        console.log("OTP sent successfully");
        setOtpSent(true);
        setTimer(60); // 60 seconds timer
        setError("");
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setOtpLoading(true);
      setError("");

      console.log("Verifying OTP...");

      // Call backend API to verify OTP
      const response = await axios.post(getApiUrl("/api/otp/verify"), {
        phoneNumber: phoneNumber,
        otp: otp,
      });

      if (response.data.success) {
        console.log("OTP verified successfully");
        setOtpVerified(true);
        setError("");
        console.log("Phone number verified successfully");
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      const errorMessage =
        err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if phone is verified
    if (!otpVerified) {
      setError("Please verify your phone number first");
      return;
    }

    // Validation
    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Validate phone number (basic validation for 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      console.log("Sending registration data:", {
        name,
        email,
        phoneNumber,
        role,
      });

      // Send registration data to backend
      const response = await axios.post(
        getApiUrl("/api/auth/register"),
        registrationData
      );

      console.log("Registration response:", response.data);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect based on user role
        if (response.data.user.role === "tutor") {
          navigate("/tutor-profile-setup");
        } else {
          navigate("/parent-dashboard");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
>>>>>>> 181f83f (Updated Features)
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 bg-white justify-center items-center p-12">
        <div className="max-w-xl">
          <img 
            src="src/assets/2.jpg" 
            alt="Register illustration" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      
=======

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Left side with illustration and info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-xl relative z-10">
          <div className="text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey!</h2>
            <p className="text-lg text-purple-100">
              Create an account to unlock personalized learning experiences and
              connect with expert tutors.
            </p>
          </div>
          <img
            src="src/assets/2.jpg"
            alt="Register illustration"
            className="w-full h-auto object-contain rounded-2xl shadow-2xl"
          />
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300">✓</div>
              <div className="text-xs text-purple-100 mt-1">
                Verified Tutors
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300">✓</div>
              <div className="text-xs text-purple-100 mt-1">
                Flexible Schedule
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-300">✓</div>
              <div className="text-xs text-purple-100 mt-1">Best Results</div>
            </div>
          </div>
        </div>
      </div>

>>>>>>> 181f83f (Updated Features)
      {/* Right side with registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
<<<<<<< HEAD
            <h1 className="text-3xl font-semibold text-gray-800 mb-3">Create an Account</h1>
            <p className="text-gray-500">
              Join our community and connect with tutors or students
            </p>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0"
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0"
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0"
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0"
                required
              />
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">I am a:</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="parent"
                    checked={role === 'parent'}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">Parent/Student</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="tutor"
                    checked={role === 'tutor'}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">Tutor</span>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <p className="text-center mt-8 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-semibold">
              Sign in
            </Link>
          </p>
=======
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join our community and start your learning journey
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-sm flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "parent" })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    role === "parent"
                      ? "border-purple-500 bg-purple-50 text-purple-700 font-semibold shadow-md"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Parent/Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "tutor" })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    role === "tutor"
                      ? "border-pink-500 bg-pink-50 text-pink-700 font-semibold shadow-md"
                      : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Tutor
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field with OTP Verification */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                Phone Number
                {otpVerified && (
                  <FaCheckCircle className="text-green-500" size={18} />
                )}
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 text-gray-900 placeholder-gray-400 transition-all duration-200 ${
                        otpVerified
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      }`}
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      disabled={otpVerified}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={
                      otpLoading ||
                      otpSent ||
                      otpVerified ||
                      !/^[0-9]{10}$/.test(phoneNumber)
                    }
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                      otpVerified
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : otpLoading ||
                          otpSent ||
                          !/^[0-9]{10}$/.test(phoneNumber)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {otpLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
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
                        Sending...
                      </span>
                    ) : otpVerified ? (
                      "Verified"
                    ) : otpSent ? (
                      `Resend ${timer > 0 ? `in ${timer}s` : ""}`
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>

                {/* OTP Input Field */}
                {otpSent && !otpVerified && (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        placeholder="Enter 6-digit OTP"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        maxLength="6"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={otpLoading || otp.length !== 6}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                        otpLoading || otp.length !== 6
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      {otpLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
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
                          Verifying...
                        </span>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  {otpVerified
                    ? "✓ Phone number verified successfully"
                    : "10-digit number without country code"}
                </p>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 text-gray-600">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleAuthButton text="Sign up with Google" />
          </div>

          {/* Sign In Link */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 text-gray-600">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              to="/login"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-200 hover:border-purple-300 py-3 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all duration-200"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In Instead
            </Link>
          </div>
>>>>>>> 181f83f (Updated Features)
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Register;
=======
export default Register;
>>>>>>> 181f83f (Updated Features)
