import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { testConnection } from '../../utils/supabase/connectionTest';

const CONNECTION_TOAST_SHOWN = 'connection_toast_shown';

export default function ConnectionToast() {
  const [showToast, setShowToast] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Check if toast was already shown
    const toastShown = localStorage.getItem(CONNECTION_TOAST_SHOWN);
    if (toastShown) return;

    const checkConnection = async () => {
      try {
        const result = await testConnection();
        setStatus(result);
        setShowToast(true);
        // Mark toast as shown
        localStorage.setItem(CONNECTION_TOAST_SHOWN, 'true');
      } catch (error) {
        setStatus({
          success: false,
          message: 'Failed to connect to database'
        });
        setShowToast(true);
      }
    };

    checkConnection();
  }, []);

  if (!showToast || !status) return null;

  return (
    <Toast
      message={status.message}
      type={status.success ? 'success' : 'error'}
      onClose={() => setShowToast(false)}
    />
  );
}