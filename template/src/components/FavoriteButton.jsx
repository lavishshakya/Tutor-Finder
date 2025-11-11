<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
=======
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../services/api";
>>>>>>> 181f83f (Updated Features)

const FavoriteButton = ({ tutorId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!currentUser || !tutorId) return;
<<<<<<< HEAD
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) return;
        
        const response = await axios.get('http://localhost:5001/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const favorites = response.data.data;
          setIsFavorite(favorites.some(tutor => tutor._id === tutorId));
        }
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };
    
=======

      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get(getApiUrl("/api/favorites"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const favorites = response.data.data;
          setIsFavorite(favorites.some((tutor) => tutor._id === tutorId));
        }
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

>>>>>>> 181f83f (Updated Features)
    checkIfFavorite();
  }, [tutorId, currentUser]);

  const toggleFavorite = async () => {
    if (!currentUser) {
      // Redirect to login or show message
      return;
    }
<<<<<<< HEAD
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:5001/api/favorites/${tutorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
=======

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (isFavorite) {
        // Remove from favorites
        await axios.delete(getApiUrl(`/api/favorites/${tutorId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
>>>>>>> 181f83f (Updated Features)
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
<<<<<<< HEAD
        await axios.post('http://localhost:5001/api/favorites', 
          { tutorId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
=======
        await axios.post(
          getApiUrl("/api/favorites"),
          { tutorId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
>>>>>>> 181f83f (Updated Features)
          }
        );
        setIsFavorite(true);
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Error toggling favorite:', error);
=======
      console.error("Error toggling favorite:", error);
>>>>>>> 181f83f (Updated Features)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  if (!currentUser || currentUser.role !== 'parent') {
=======
  if (!currentUser || currentUser.role !== "parent") {
>>>>>>> 181f83f (Updated Features)
    return null;
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
<<<<<<< HEAD
        isFavorite 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } transition-colors duration-200 ${
        loading ? 'opacity-75 cursor-wait' : 'cursor-pointer'
      }`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
=======
        isFavorite
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } transition-colors duration-200 ${
        loading ? "opacity-75 cursor-wait" : "cursor-pointer"
      }`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
>>>>>>> 181f83f (Updated Features)
    >
      {isFavorite ? (
        <>
          <FaHeart className="text-red-500" />
          <span>Favorited</span>
        </>
      ) : (
        <>
          <FaRegHeart />
          <span>Add to Favorites</span>
        </>
      )}
    </button>
  );
};

<<<<<<< HEAD
export default FavoriteButton;
=======
export default FavoriteButton;
>>>>>>> 181f83f (Updated Features)
