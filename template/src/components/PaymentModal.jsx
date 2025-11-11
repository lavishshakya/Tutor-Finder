import React, { useState } from "react";
import { FaTimes, FaCheckCircle, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { getApiUrl } from "../services/api";

const PaymentModal = ({ isOpen, onClose, user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const REGISTRATION_FEE = 100; // ₹100 fixed charge

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
    setLoading(true);
    setError("");

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError(
          "Failed to load Razorpay SDK. Please check your internet connection."
        );
        setLoading(false);
        return;
      }

      // Step 1: Create order on backend
      const orderResponse = await axios.post(
        getApiUrl("/api/razorpay/create-order"),
        {
          amount: REGISTRATION_FEE,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const { order, key } = orderResponse.data;

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
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verifyResponse.data.success) {
              // Update user in localStorage
              const updatedUser = verifyResponse.data.user;
              localStorage.setItem("user", JSON.stringify(updatedUser));

              setPaymentSuccess(true);
              setLoading(false);

              // Close modal after 2 seconds and reload page
              setTimeout(() => {
                onClose();
                window.location.reload();
              }, 2000);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setError(
              error.response?.data?.message || "Payment verification failed"
            );
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process payment. Please try again."
      );
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          {paymentSuccess ? (
            // Success State
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <FaCheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                Your registration fee has been paid successfully. Redirecting...
              </p>
            </div>
          ) : (
            <>
              {/* Close Button */}
              <button
                onClick={() => onClose(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  <FaRupeeSign className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Registration Fee
                </h2>
                <p className="text-gray-600">
                  Complete your registration by paying a one-time fee
                </p>
              </div>

              {/* Amount Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">
                    Registration Fee
                  </span>
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{REGISTRATION_FEE}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  One-time payment • Lifetime access
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">
                    Access to all tutors and courses
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">
                    Verified tutor profiles and reviews
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">
                    Direct communication with tutors
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">
                    Priority customer support
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
                <button
                  onClick={() => onClose(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Pay Later
                </button>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Razorpay
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
