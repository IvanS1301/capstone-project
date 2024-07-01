import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { userLG: action.payload }
    case 'LOGOUT':
      return { userLG: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    userLG: null
  })

  useEffect(() => {
    const userLG = JSON.parse(localStorage.getItem('userLG'))

    if (userLG) {
      dispatch({ type: 'LOGIN', payload: userLG }) 
    }
  }, [])

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}