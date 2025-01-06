import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const { toast } = useToast();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setIsValid(validateEmail(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if already loading
    if (loading) return;

    setLoading(true);
    setMessage(''); // Clear any previous messages before new request

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/forgot-password`, { email });
      setMessage('Check your email for the reset link.');

    } catch (error) {
      // Handle backend crashes or network issues
      if (!error.response) {
        // Network or server-related error (Backend down, network error)
        setMessage('Error: Unable to reach the server. Please try again later.');
      } else if (error.response.status === 401) {
       
        setMessage('Error: Invalid email address.');
      } else {
        // Generic error
        setMessage('Error sending reset link. Please try again.');
      }
    } finally {
      setLoading(false); // Re-enable the button after the request is finished
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-600">
          Enter the email associated with your account, and we'll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@domain.com"
              value={email}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none ${
                isValid ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500' : 'border-red-500'
              }`}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className={`w-full py-2 px-4 border rounded-md shadow-sm text-white ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`text-center mt-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}
            aria-live="polite"
          >
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
