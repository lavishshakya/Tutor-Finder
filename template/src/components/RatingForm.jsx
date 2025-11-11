import React, { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { getApiUrl } from "../services/api";


const RatingForm = ({ tutorId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const response = await axios.post(
        getApiUrl(`/api/tutors/${tutorId}/reviews`),
        { rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(true);
        setReview("");
        setRating(0);
        if (onSuccess) onSuccess();
      } else {
        setError(response.data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Rate & Review Tutor</h3>


      {success ? (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          Your review has been submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}


          <div className="mb-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">Rating: </span>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <div key={index} className="mr-1">
                      <FaStar
                        className="cursor-pointer"
                        color={
                          ratingValue <= (hover || rating)
                            ? "#ffc107"
                            : "#e4e5e9"
                        }

                        size={28}
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 mb-1"
            >

              Your Review (Optional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Share your experience with this tutor..."
            ></textarea>
          </div>


          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Review"}

          </button>
        </form>
      )}
    </div>
  );
};

export default RatingForm;

