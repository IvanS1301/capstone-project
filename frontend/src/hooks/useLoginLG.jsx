import { useState } from 'react';
import { URL } from "../utils/URL";
import { useAuthContext } from './useAuthContext';

export const useLoginLG = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const loginLG = async (email, password) => {
    setIsLoading(true);
    setError(null);

    console.log('Logging in with:', email); // Log email for debugging

    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        return response;
      } catch (error) {
        if (retries > 0) {
          console.log(`Retrying... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(url, options, retries - 1, delay);
        } else {
          throw error;
        }
      }
    };

    try {
      const response = await fetchWithRetry(`${URL}/api/userLG/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status); // Log response status

      const json = await response.json();

      if (!response.ok) {
        console.error('Login error:', json.error); // Log error
        setIsLoading(false);
        setError(json.error);
        return;
      }

      // Save the user to localStorage
      localStorage.setItem('userLG', JSON.stringify({
        _id: json._id,
        name: json.name,
        email: json.email,
        token: json.token,
        role: json.role // Include the role in the user object
      }));

      // Update the auth context
      dispatch({
        type: 'LOGIN', payload: {
          _id: json._id,
          name: json.name,
          email: json.email,
          token: json.token,
          role: json.role // Include the role in the user object
        }
      });

      // Update loading state
      setIsLoading(false);
    } catch (err) {
      console.error('Network error:', err); // Log network error
      setIsLoading(false);
      setError('Network error. Please try again later.');
    }
  };

  return { loginLG, isLoading, error };
};
