import React, { useState } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import PaymentModal from "./PaymentModal";

const ActivateProfileBanner = ({ user }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show for tutors who haven't paid and banner is not dismissed
  if (user?.role !== "tutor" || user?.registrationFeePaid || isDismissed) {
    return null;
  }

  const handleActivateClick = () => {
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <>
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <div className="bg-white/20 rounded-full p-3">
                  <FaExclamationTriangle className="text-2xl animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  Activate Your Tutor Profile
                </h3>
                <p className="text-sm text-white/90">
                  Complete your registration by paying ₹100 to unlock all
                  features and start receiving student requests.
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center space-x-3">
                <button
                  onClick={handleActivateClick}
                  className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Activate Now
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Dismiss"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        user={user}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ActivateProfileBanner;
