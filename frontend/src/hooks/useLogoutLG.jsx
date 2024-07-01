import { useAuthContext } from './useAuthContext'
import { useLeadsContext } from "../hooks/useLeadsContext"
import { useUsersContext } from "../hooks/useUsersContext"

export const useLogoutLG = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchLeads } = useLeadsContext()
  const { dispatch: dispatchUsers } = useUsersContext() 

  const logoutLG = () => {
    // Get the user token from local storage
    const userLG = JSON.parse(localStorage.getItem('userLG'))

    // Set up headers with the authentication token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userLG.token}`
    }

    // Send a request to the backend logout endpoint
    fetch('/api/userLG/logout', {
      method: 'POST',
      headers: headers
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Logout request failed')
      }
      // Clear user data from local storage
      localStorage.removeItem('userLG')
      // Dispatch logout action
      dispatch({ type: 'LOGOUT' })
      // Dispatch action to reset leads data
      dispatchLeads({ type: 'SET_LEADS', payload: null })
      // Dispatch action to reset users data
      dispatchUsers({ type: 'SET_USERS', payload: [] })
    })
    .catch(error => {
      console.error('Logout error:', error);
      // Handle any logout errors here
    })
  }

  return { logoutLG }
}