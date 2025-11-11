<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaComments, FaStar, FaRegStar, FaTrash } from 'react-icons/fa';
=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaComments,
  FaStar,
  FaRegStar,
  FaTrash,
} from "react-icons/fa";
import { getApiUrl } from "../services/api";
>>>>>>> 181f83f (Updated Features)

const FavoriteTutors = ({ onStartChat }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState('');
=======
  const [error, setError] = useState("");
>>>>>>> 181f83f (Updated Features)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        console.log('Fetching favorite tutors...');
        
        const response = await axios.get('http://localhost:5001/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Favorites response:', response.data);
        
        if (response.data.success) {
          setFavorites(response.data.data);
        } else {
          setError('Failed to load favorites');
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Error loading favorite tutors. Please try again.');
=======
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        console.log("Fetching favorite tutors...");

        const response = await axios.get(getApiUrl("/api/favorites"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Favorites response:", response.data);

        if (response.data.success) {
          setFavorites(response.data.data);
        } else {
          setError("Failed to load favorites");
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Error loading favorite tutors. Please try again.");
>>>>>>> 181f83f (Updated Features)
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (tutorId) => {
    try {
<<<<<<< HEAD
      const token = localStorage.getItem('token');
      
      if (!token) return;
      
      const response = await axios.delete(`http://localhost:5001/api/favorites/${tutorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Remove tutor from local state
        setFavorites(favorites.filter(tutor => tutor._id !== tutorId));
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
=======
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.delete(
        getApiUrl(`/api/favorites/${tutorId}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove tutor from local state
        setFavorites(favorites.filter((tutor) => tutor._id !== tutorId));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
>>>>>>> 181f83f (Updated Features)
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
<<<<<<< HEAD
    
=======

>>>>>>> 181f83f (Updated Features)
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
<<<<<<< HEAD
    
=======

>>>>>>> 181f83f (Updated Features)
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          <span className="flex items-center">
            <FaHeart className="text-red-500 mr-2" />
            Favorite Tutors
          </span>
        </h3>
<<<<<<< HEAD
        <Link to="/tutors" className="text-indigo-600 hover:text-indigo-800 text-sm">
          Find more
        </Link>
      </div>
      
=======
        <Link
          to="/tutors"
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          Find more
        </Link>
      </div>

>>>>>>> 181f83f (Updated Features)
      {loading ? (
        <div className="py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-red-500">{error}</p>
<<<<<<< HEAD
          <Link to="/tutors" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
=======
          <Link
            to="/tutors"
            className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
>>>>>>> 181f83f (Updated Features)
            Browse Tutors
          </Link>
        </div>
      ) : favorites.length > 0 ? (
        <div className="space-y-4">
<<<<<<< HEAD
          {favorites.map(tutor => (
            <div key={tutor._id} className="border-b border-gray-200 pb-4 last:border-none">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Link to={`/tutors/${tutor._id}`}>
                    <img 
                      src={tutor.profilePicture || "https://via.placeholder.com/60x60?text=T"} 
                      alt={tutor.name} 
=======
          {favorites.map((tutor) => (
            <div
              key={tutor._id}
              className="border-b border-gray-200 pb-4 last:border-none"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Link to={`/tutors/${tutor._id}`}>
                    <img
                      src={
                        tutor.profilePicture ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%23e5e7eb' width='60' height='60'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E"
                      }
                      alt={tutor.name}
>>>>>>> 181f83f (Updated Features)
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </Link>
                </div>
<<<<<<< HEAD
                
                <div className="flex-1 min-w-0">
                  <Link to={`/tutors/${tutor._id}`} className="text-gray-900 font-medium hover:text-indigo-600">
                    {tutor.name}
                  </Link>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {Array.isArray(tutor.subjects) ? tutor.subjects.slice(0, 2).join(', ') : "No subjects listed"}
                    {Array.isArray(tutor.subjects) && tutor.subjects.length > 2 ? '...' : ''}
                  </p>
                  
=======

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/tutors/${tutor._id}`}
                    className="text-gray-900 font-medium hover:text-indigo-600"
                  >
                    {tutor.name}
                  </Link>

                  <p className="text-sm text-gray-600 truncate mt-1">
                    {Array.isArray(tutor.subjects)
                      ? tutor.subjects.slice(0, 2).join(", ")
                      : "No subjects listed"}
                    {Array.isArray(tutor.subjects) && tutor.subjects.length > 2
                      ? "..."
                      : ""}
                  </p>

>>>>>>> 181f83f (Updated Features)
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center mr-2">
                      {renderStars(tutor.rating || 0)}
                    </div>
                    <span className="text-xs text-gray-500">
<<<<<<< HEAD
                      {tutor.rating ? `${tutor.rating.toFixed(1)}` : 'No ratings'}
                    </span>
                  </div>
                  
=======
                      {tutor.rating
                        ? `${tutor.rating.toFixed(1)}`
                        : "No ratings"}
                    </span>
                  </div>

>>>>>>> 181f83f (Updated Features)
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => onStartChat(tutor)}
                      className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <FaComments className="text-blue-600" />
                      <span>Chat</span>
                    </button>
<<<<<<< HEAD
                    
                    <Link 
                      to={`/tutors/${tutor._id}`} 
=======

                    <Link
                      to={`/tutors/${tutor._id}`}
>>>>>>> 181f83f (Updated Features)
                      className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <span>View Profile</span>
                    </Link>
<<<<<<< HEAD
                    
=======

>>>>>>> 181f83f (Updated Features)
                    <button
                      onClick={() => handleRemoveFavorite(tutor._id)}
                      className="flex items-center space-x-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 transition-colors"
                      title="Remove from favorites"
                    >
                      <FaTrash className="text-red-600" size={10} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
<<<<<<< HEAD
                
=======

>>>>>>> 181f83f (Updated Features)
                {tutor.monthlyRate && (
                  <div className="flex-shrink-0 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ₹{tutor.monthlyRate}/month
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <FaHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
<<<<<<< HEAD
          <p className="text-gray-500 mb-4">You haven't added any tutors to favorites yet</p>
          <Link to="/tutors" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition duration-200">
=======
          <p className="text-gray-500 mb-4">
            You haven't added any tutors to favorites yet
          </p>
          <Link
            to="/tutors"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
          >
>>>>>>> 181f83f (Updated Features)
            Find Tutors
          </Link>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default FavoriteTutors;
=======
export default FavoriteTutors;
>>>>>>> 181f83f (Updated Features)
