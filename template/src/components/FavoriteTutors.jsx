import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaComments, FaStar, FaRegStar, FaTrash } from 'react-icons/fa';

const FavoriteTutors = ({ onStartChat }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (tutorId) => {
    try {
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
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
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
        <Link to="/tutors" className="text-indigo-600 hover:text-indigo-800 text-sm">
          Find more
        </Link>
      </div>
      
      {loading ? (
        <div className="py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-red-500">{error}</p>
          <Link to="/tutors" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
            Browse Tutors
          </Link>
        </div>
      ) : favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map(tutor => (
            <div key={tutor._id} className="border-b border-gray-200 pb-4 last:border-none">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Link to={`/tutors/${tutor._id}`}>
                    <img 
                      src={tutor.profilePicture || "https://via.placeholder.com/60x60?text=T"} 
                      alt={tutor.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </Link>
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/tutors/${tutor._id}`} className="text-gray-900 font-medium hover:text-indigo-600">
                    {tutor.name}
                  </Link>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {Array.isArray(tutor.subjects) ? tutor.subjects.slice(0, 2).join(', ') : "No subjects listed"}
                    {Array.isArray(tutor.subjects) && tutor.subjects.length > 2 ? '...' : ''}
                  </p>
                  
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center mr-2">
                      {renderStars(tutor.rating || 0)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {tutor.rating ? `${tutor.rating.toFixed(1)}` : 'No ratings'}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => onStartChat(tutor)}
                      className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <FaComments className="text-blue-600" />
                      <span>Chat</span>
                    </button>
                    
                    <Link 
                      to={`/tutors/${tutor._id}`} 
                      className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <span>View Profile</span>
                    </Link>
                    
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
          <p className="text-gray-500 mb-4">You haven't added any tutors to favorites yet</p>
          <Link to="/tutors" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition duration-200">
            Find Tutors
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoriteTutors;