import { useState } from 'react'
import { URL } from "@utils/URL";
import { useAuthContext } from './useAuthContext'

export const useLoginLG = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const loginLG = async (email, password, role) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(`${URL}/api/userLG/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // Save the user to localStorage
      localStorage.setItem('userLG', JSON.stringify({
        _id: json._id,
        name: json.name,
        email: json.email,
        token: json.token,
        role: json.role // Include the role in the user object
      }))

      // Update the auth context
      dispatch({
        type: 'LOGIN', payload: {
          _id: json._id,
          name: json.name,
          email: json.email,
          token: json.token,
          role: json.role // Include the role in the user object
        }
      })

      // Update loading state
      setIsLoading(false)
    }
  }

  return { loginLG, isLoading, error }
}
