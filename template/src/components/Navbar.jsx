import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./style.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const userButtonRef = useRef(null);
  const userMenuRef = useRef(null);

  // Generate avatar SVG data URL
  const generateAvatarSVG = (name) => {
    const initials = (name || "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect fill='%236366F1' width='128' height='128'/><text fill='%23fff' font-family='sans-serif' font-size='48' dy='10.5' font-weight='bold' x='50%' y='50%' text-anchor='middle'>${initials}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.src = generateAvatarSVG(currentUser?.name || "User");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle user dropdown
      if (
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 fixed top-0 z-50 w-full shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center group">
              {/* Shield Logo with Graduation Cap and Book */}
              <div className="relative mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 100 100"
                  className="drop-shadow-lg"
                >
                  {/* Shield background */}
                  <path
                    d="M50 5 L15 20 L15 45 Q15 70 50 95 Q85 70 85 45 L85 20 Z"
                    fill="url(#shieldGradient)"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient
                      id="shieldGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#1e40af", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>

                  {/* Book */}
                  <rect
                    x="35"
                    y="55"
                    width="30"
                    height="20"
                    rx="2"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                  <line
                    x1="50"
                    y1="55"
                    x2="50"
                    y2="75"
                    stroke="#1e40af"
                    strokeWidth="2"
                  />
                  <line
                    x1="35"
                    y1="60"
                    x2="48"
                    y2="60"
                    stroke="#1e40af"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <line
                    x1="35"
                    y1="65"
                    x2="48"
                    y2="65"
                    stroke="#1e40af"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <line
                    x1="52"
                    y1="60"
                    x2="65"
                    y2="60"
                    stroke="#1e40af"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <line
                    x1="52"
                    y1="65"
                    x2="65"
                    y2="65"
                    stroke="#1e40af"
                    strokeWidth="1"
                    opacity="0.5"
                  />

                  {/* Graduation Cap */}
                  <polygon points="50,25 30,32 50,39 70,32" fill="#fbbf24" />
                  <rect x="48" y="39" width="4" height="12" fill="#fbbf24" />
                  <circle cx="50" cy="51" r="3" fill="#fbbf24" />
                  <polygon points="48,28 52,28 50,22" fill="#fbbf24" />

                  {/* Stars/Sparkles */}
                  <circle cx="35" cy="40" r="2" fill="#fbbf24" opacity="0.8" />
                  <circle cx="65" cy="40" r="2" fill="#fbbf24" opacity="0.8" />
                  <circle
                    cx="45"
                    cy="45"
                    r="1.5"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                  <circle
                    cx="55"
                    cy="45"
                    r="1.5"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-white font-extrabold text-2xl tracking-tight leading-none group-hover:tracking-wide transition-all duration-300">
                  TUTOR{" "}
                  <span className="text-yellow-400 drop-shadow-lg">FINDER</span>
                </span>
                <span className="text-blue-200 text-xs font-medium tracking-wider uppercase opacity-90">
                  Learn & Grow
                </span>
              </div>
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-white rounded-md p-2 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-md font-semibold"
                      : "text-white hover:bg-yellow-400 hover:text-indigo-900"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/tutors"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-md font-semibold"
                      : "text-white hover:bg-yellow-400 hover:text-indigo-900"
                  }`
                }
              >
                Find Tutors
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-md font-semibold"
                      : "text-white hover:bg-yellow-400 hover:text-indigo-900"
                  }`
                }
              >
                About Us
              </NavLink>
              <NavLink
                to="/ai-assistant"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-md font-semibold"
                      : "text-white hover:bg-yellow-400 hover:text-indigo-900"
                  }`
                }
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 7H7v6h6V7z" />
                  <path
                    fillRule="evenodd"
                    d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                    clipRule="evenodd"
                  />
                </svg>
                AI Assistant
              </NavLink>

              {currentUser ? (
                <Link
                  to={
                    currentUser.role === "tutor"
                      ? "/tutor-dashboard"
                      : "/parent-dashboard"
                  }
                  className="flex items-center bg-white hover:bg-yellow-400 text-indigo-900 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-200 shadow-md hover:shadow-lg ml-3"
                >
                  <div className="flex items-center">
                    {currentUser.profilePicture ? (
                      <img
                        src={currentUser.profilePicture}
                        alt={currentUser.name}
                        className="h-9 w-9 rounded-full object-cover mr-3 border-2 border-indigo-600 shadow-sm"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mr-3 shadow-sm">
                        {currentUser.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="font-semibold">{currentUser.name}</span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="flex items-center bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-5 py-2 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - with profile photo support */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-gradient-to-b from-indigo-800 to-purple-900 shadow-2xl`}
      >
        <div className="px-3 pt-3 pb-4 space-y-2">
          {/* Navigation Links */}
          <div className="space-y-1 mb-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                  : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              🏠 Home
            </NavLink>
            <NavLink
              to="/tutors"
              className={({ isActive }) =>
                isActive
                  ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                  : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              🔍 Find Tutors
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                  : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              ℹ️ About Us
            </NavLink>
            <NavLink
              to="/ai-assistant"
              className={({ isActive }) =>
                isActive
                  ? "bg-white/20 text-white backdrop-blur-sm px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400 flex items-center gap-3"
                  : "text-gray-200 hover:bg-white/10 hover:text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 flex items-center gap-3"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path
                  fillRule="evenodd"
                  d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                  clipRule="evenodd"
                />
              </svg>
              AI Assistant
            </NavLink>
          </div>

          {currentUser ? (
            <>
              {/* User Profile Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 mb-3 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  {currentUser.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-yellow-400 text-indigo-900 font-bold text-xl flex items-center justify-center shadow-lg">
                      {currentUser.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white font-bold text-base">
                      {currentUser.name}
                    </p>
                    <p className="text-yellow-300 text-xs font-medium capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dashboard Links */}
              <div className="space-y-1 mb-3">
                {currentUser.role === "tutor" ? (
                  <>
                    <NavLink
                      to="/tutor-dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                          : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📊 Dashboard
                    </NavLink>
                    <NavLink
                      to="/edit-tutor-profile"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                          : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ✏️ Edit Profile
                    </NavLink>
                    <NavLink
                      to="/tutor-bookings"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                          : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📅 My Bookings
                    </NavLink>
                    <NavLink
                      to="/tutor-reviews"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                          : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⭐ My Reviews
                    </NavLink>
                  </>
                ) : (
                  <NavLink
                    to="/parent-dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-white/20 text-white backdrop-blur-sm block px-4 py-3 rounded-xl text-base font-semibold shadow-lg border-l-4 border-yellow-400"
                        : "text-gray-200 hover:bg-white/10 hover:text-white block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📊 Dashboard
                  </NavLink>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-full px-4 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Section for Guests */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-4 mb-3 shadow-xl">
                <p className="text-indigo-900 font-bold text-base mb-3 text-center">
                  👋 Welcome, newStudent
                </p>
              </div>

              <div className="space-y-2">
                <NavLink
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white block px-4 py-3 rounded-xl text-base font-bold text-center shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔐 Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white block px-4 py-3 rounded-xl text-base font-bold text-center shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ✨ Register Now
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

