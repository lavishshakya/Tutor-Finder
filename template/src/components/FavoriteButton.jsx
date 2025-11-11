import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../services/api";


const FavoriteButton = ({ tutorId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!currentUser || !tutorId) return;

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


    checkIfFavorite();
  }, [tutorId, currentUser]);

  const toggleFavorite = async () => {
    if (!currentUser) {
      // Redirect to login or show message
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (isFavorite) {
        // Remove from favorites
        await axios.delete(getApiUrl(`/api/favorites/${tutorId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(
          getApiUrl("/api/favorites"),
          { tutorId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);

    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "parent") {

    return null;
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
        isFavorite
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } transition-colors duration-200 ${
        loading ? "opacity-75 cursor-wait" : "cursor-pointer"
      }`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}

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

export default FavoriteButton;

