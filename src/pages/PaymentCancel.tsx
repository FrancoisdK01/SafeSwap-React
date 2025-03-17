import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/transactions");
    }, 3000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header */}
      <div className="w-full bg-red-500 py-4 text-center">
        <h1 className="text-white text-2xl font-bold">SafeSwap</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center mt-8">
        <h2 className="text-2xl font-semibold text-red-600">Payment Canceled</h2>
        <p className="text-gray-600 mt-2">Your payment was canceled. No funds were deducted.</p>

        {/* Redirect Message */}
        <p className="text-gray-500 text-sm mt-4">
          Redirecting to transactions page...
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>© {new Date().getFullYear()} SafeSwap. All rights reserved.</p>
        <p className="text-blue-500">Proudly South African 🇿🇦</p>
      </div>
    </div>
  );
};

export default PaymentCancel;
