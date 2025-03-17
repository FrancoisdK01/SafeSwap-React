import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PaymentStatusProps {
  title: string;
  message: string;
  bgColor: string;
  textColor: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ title, message, bgColor, textColor }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/transactions");
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header */}
      <div className={`w-full ${bgColor} py-4 text-center`}>
        <h1 className="text-white text-2xl font-bold">SafeSwap</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center mt-8">
        <h2 className={`text-2xl font-semibold ${textColor}`}>{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>

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

export default PaymentStatus;
