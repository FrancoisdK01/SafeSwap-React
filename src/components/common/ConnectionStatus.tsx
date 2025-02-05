import React, { useState, useEffect } from 'react';
import { testConnection } from '../../utils/supabase/connectionTest';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<{
    success: boolean;
    authenticated: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testConnection();
        setStatus(result);
      } catch (error) {
        console.error('Failed to test connection:', error);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-blue-50 text-blue-700 flex items-center gap-2">
        <FaSpinner className="animate-spin" />
        <span>Testing database connection...</span>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className={`p-4 rounded-lg flex items-center gap-2 ${
      status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      {status.success ? (
        <FaCheckCircle className="flex-shrink-0" />
      ) : (
        <FaExclamationCircle className="flex-shrink-0" />
      )}
      <p className="font-medium">{status.message}</p>
    </div>
  );
}