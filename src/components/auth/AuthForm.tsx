import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthErrorMessage } from '../../utils/auth/errorHandler';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(getAuthErrorMessage(signInError));
        }
      } else {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
          } else {
            setError(getAuthErrorMessage(signUpError));
          }
        } else {
          setSuccess('Registration successful! You can now sign in.');
          setEmail('');
          setPassword('');
        }
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm 
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          minLength={8}
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-500 bg-green-50 p-3 rounded">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium 
          hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
}