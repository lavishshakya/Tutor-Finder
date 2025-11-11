import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RazorpayPayment from "../components/RazorpayPayment";
import axios from "axios";
import { FaCheckCircle, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import { getApiUrl } from "../services/api";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(getApiUrl("/api/razorpay/status"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPaymentStatus(response.data.paymentStatus);

        // If already paid, redirect to dashboard after 3 seconds
        if (response.data.paymentStatus.paid) {
          setTimeout(() => {
            navigate("/tutor-dashboard");
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (data) => {
    console.log("Payment successful:", data);
    setPaymentStatus({ paid: true });

    // Show success message and redirect
    setTimeout(() => {
      navigate("/tutor-dashboard");
    }, 2000);
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (paymentStatus?.paid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-5xl text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your registration fee has been paid successfully.
            </p>
          </div>

          {paymentStatus.details && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-700 mb-2">
                Payment Details:
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Amount:</span> ₹
                  {paymentStatus.details.amount}
                </p>
                <p>
                  <span className="font-medium">Payment ID:</span>{" "}
                  {paymentStatus.details.paymentId}
                </p>
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {paymentStatus.details.method}
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-4">
            Redirecting to dashboard...
          </p>

          <button
            onClick={() => navigate("/tutor-dashboard")}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Complete Your Registration
          </h1>
          <p className="text-gray-600">
            Pay the one-time registration fee to start tutoring
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What you get:
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">
                  Complete profile visibility to parents
                </p>
              </div>
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">
                  Direct message access with interested parents
                </p>
              </div>
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">
                  Dashboard to manage your tutoring profile
                </p>
              </div>
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">Access to all platform features</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  One-time Registration Fee
                </p>
                <p className="text-4xl font-bold text-purple-600">₹100</p>
              </div>
              <FaCreditCard className="text-5xl text-purple-400" />
            </div>
          </div>

          {/* Payment Button */}
          <RazorpayPayment
            amount={100}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <FaShieldAlt className="mr-2" />
            <span>256-bit SSL Encrypted Payment</span>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a one-time fee. Parents register
              for free, while tutors pay this small fee to access the platform
              and connect with students.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
