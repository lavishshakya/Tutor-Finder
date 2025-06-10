import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './style.css'; 

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLoginOptions, setShowLoginOptions] = useState(false);
    const { currentUser, logout } = useAuth();
    const loginButtonRef = useRef(null);
    const loginMenuRef = useRef(null);
    const userButtonRef = useRef(null);
    const userMenuRef = useRef(null);

    // Handle image loading errors
    const handleImageError = (e) => {
        console.log("Profile image failed to load");
        e.target.onerror = null; // Prevent infinite error loop
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=6366F1&color=fff&size=128`;
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
            // Handle login dropdown
            if (loginButtonRef.current && !loginButtonRef.current.contains(event.target) && 
                loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
                setShowLoginOptions(false);
            }
            
            // Handle user dropdown
            if (userButtonRef.current && !userButtonRef.current.contains(event.target) && 
                userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debug current user data
    useEffect(() => {
        if (currentUser) {
            console.log("Current user in navbar:", currentUser);
            console.log("Profile picture URL:", currentUser.profilePicture);
        }
    }, [currentUser]);

    return (
        <nav className="bg-gray-800 fixed top-0 z-50 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-white font-bold text-xl">
                            Tutor Finder
                        </NavLink>
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button 
                            type="button" 
                            onClick={toggleMenu} 
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                    
                    {/* Desktop menu */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => 
                                    isActive 
                                        ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" 
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink 
                                to="/tutors" 
                                className={({ isActive }) => 
                                    isActive 
                                        ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" 
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                }
                            >
                                Find Tutors
                            </NavLink>
                            <NavLink 
                                to="/about" 
                                className={({ isActive }) => 
                                    isActive 
                                        ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" 
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                }
                            >
                                About Us
                            </NavLink>
                            
                            {currentUser ? (
                                <div className="relative">
                                    <button
                                        ref={userButtonRef}
                                        onMouseEnter={() => setShowUserMenu(true)}
                                        onClick={toggleUserMenu}
                                        className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                                    >
                                        <div className="flex items-center">
                                            {currentUser.profilePicture ? (
                                                <img 
                                                    src={currentUser.profilePicture}
                                                    alt={currentUser.name}
                                                    className="h-8 w-8 rounded-full object-cover mr-2 border-2 border-gray-700"
                                                    onError={handleImageError}
                                                />
                                            ) : (
                                                <span className="bg-gray-700 text-green-400 font-bold px-3 py-1 rounded-md mr-2">
                                                    {currentUser.name?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                            <span className="font-medium text-gray-100">{currentUser.name}</span>
                                        </div>
                                        <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {showUserMenu && (
                                        <div 
                                            ref={userMenuRef}
                                            onMouseLeave={() => setShowUserMenu(false)}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                                        >
                                            <NavLink 
                                                to={currentUser.role === 'tutor' ? "/tutor-dashboard" : "/parent-dashboard"} 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Dashboard
                                            </NavLink>
                                            
                                            {currentUser.role === 'tutor' && (
                                                <>
                                                    <NavLink
                                                        to="/edit-tutor-profile"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Edit Profile
                                                    </NavLink>
                                                    <NavLink
                                                        to="/tutor-bookings"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        My Bookings
                                                    </NavLink>
                                                    <NavLink
                                                        to="/tutor-reviews"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        My Reviews
                                                    </NavLink>
                                                </>
                                            )}
                                            
                                            {currentUser.role === 'parent' && (
                                                <NavLink
                                                    to="/favorite-tutors"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Favorite Tutors
                                                </NavLink>
                                            )}
                                            
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowUserMenu(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        ref={loginButtonRef}
                                        onMouseEnter={() => setShowLoginOptions(true)}
                                        onClick={() => setShowLoginOptions(!showLoginOptions)}
                                        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                                    >
                                        <span className="mr-1">Login</span>
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {showLoginOptions && (
                                        <div 
                                            ref={loginMenuRef}
                                            onMouseLeave={() => setShowLoginOptions(false)}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                                        >
                                            <NavLink 
                                                to="/login" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowLoginOptions(false)}
                                            >
                                                Parent Login
                                            </NavLink>
                                            <NavLink 
                                                to="/login?type=tutor" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowLoginOptions(false)}
                                            >
                                                Tutor Login
                                            </NavLink>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <NavLink 
                                                to="/register" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowLoginOptions(false)}
                                            >
                                                Register
                                            </NavLink>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile menu - with profile photo support */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => 
                            isActive 
                                ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/tutors" 
                        className={({ isActive }) => 
                            isActive 
                                ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Find Tutors
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => 
                            isActive 
                                ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        }
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About Us
                    </NavLink>
                    
                    {currentUser ? (
                        <>
                            <div className="text-gray-100 font-medium px-3 py-2 border-b border-gray-700 flex items-center gap-2">
                                Welcome, 
                                {currentUser.profilePicture ? (
                                    <div className="inline-block">
                                        <img 
                                            src={currentUser.profilePicture} 
                                            alt={currentUser.name}
                                            className="w-8 h-8 rounded-full inline-block object-cover border border-gray-600"
                                            onError={handleImageError}
                                        />
                                    </div>
                                ) : (
                                    <span className="bg-gray-700 text-green-400 font-bold px-2 py-1 rounded-md inline-block">
                                        {currentUser.name?.charAt(0) || 'U'}
                                    </span>
                                )}
                                <span className="ml-1">{currentUser.name}</span>
                            </div>
                            
                            {currentUser.role === 'tutor' ? (
                                <>
                                    <NavLink 
                                        to="/tutor-dashboard" 
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink 
                                        to="/edit-tutor-profile" 
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Edit Profile
                                    </NavLink>
                                    <NavLink 
                                        to="/tutor-bookings" 
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Bookings
                                    </NavLink>
                                    <NavLink 
                                        to="/tutor-reviews" 
                                        className={({ isActive }) => 
                                            isActive 
                                                ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Reviews
                                    </NavLink>
                                </>
                            ) : (
                                <NavLink 
                                    to="/parent-dashboard" 
                                    className={({ isActive }) => 
                                        isActive 
                                            ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" 
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    }
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </NavLink>
                            )}
                            
                            <button
                                onClick={() => {
                                  logout();
                                  setIsMenuOpen(false);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="text-gray-100 font-medium px-3 py-2 border-b border-gray-700">
                                Login Options
                            </div>
                            <NavLink 
                                to="/login" 
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Parent Login
                            </NavLink>
                            <NavLink 
                                to="/login?type=tutor" 
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Tutor Login
                            </NavLink>
                            <NavLink 
                                to="/register" 
                                className="bg-green-500 hover:bg-green-600 text-white block px-3 py-2 rounded-md text-base font-medium mt-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;