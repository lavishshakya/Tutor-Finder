import React, { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../services/api";

const RazorpayPayment = ({ amount = 100, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError(
          "Failed to load Razorpay SDK. Please check your internet connection."
        );
        setLoading(false);
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to continue");
        setLoading(false);
        return;
      }

      // Create order on backend
      const orderResponse = await axios.post(
        getApiUrl("/api/razorpay/create-order"),
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const { order, key } = orderResponse.data;

      // Get user details
      const user = JSON.parse(localStorage.getItem("user"));

      // Razorpay payment options
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Tutor Finder",
        description: "Tutor Registration Fee",
        order_id: order.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phoneNumber || "",
        },
        theme: {
          color: "#9333ea", // Purple color
        },
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              getApiUrl("/api/razorpay/verify"),
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyResponse.data.success) {
              // Update user in localStorage
              const updatedUser = verifyResponse.data.user;
              localStorage.setItem("user", JSON.stringify(updatedUser));

              console.log("Payment successful!");
              if (onSuccess) {
                onSuccess(verifyResponse.data);
              }
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setError(
              error.response?.data?.message || "Payment verification failed"
            );
            if (onFailure) {
              onFailure(error);
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment cancelled");
            if (onFailure) {
              onFailure(new Error("Payment cancelled by user"));
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setError(
        error.response?.data?.message || error.message || "Payment failed"
      );
      setLoading(false);
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <div className="razorpay-payment">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Processing...
          </span>
        ) : (
          `Pay ₹${amount} - Registration Fee`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-2">
        Secure payment powered by Razorpay
      </p>
    </div>
  );
};

export default RazorpayPayment;
