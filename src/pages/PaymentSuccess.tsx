// ** This is the Payfast Success Page 
// when payfast sends a post request to 

import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTransactions } from "../contexts/TransactionContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateTransactionStatus } = useTransactions();

  // Extract query parameters
  const status = searchParams.get("status");
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    if (status === "success" && transactionId) {
      updateTransactionStatus(transactionId, "paid");

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/transactions");
      }, 3000);
    }
  }, [status, transactionId, updateTransactionStatus, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* SafeSwap Header */}
      <div className="w-full bg-blue-500 py-4 text-center">
        <h1 className="text-white text-2xl font-bold">SafeSwap</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center mt-8">
        {status === "success" ? (
          <>
            <h2 className="text-2xl font-semibold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">Your payment was processed successfully.</p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700">
                <strong>Transaction ID:</strong> {transactionId}
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
            <p className="text-gray-600 mt-2">Something went wrong with your payment.</p>
          </>
        )}

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

export default PaymentSuccess;
