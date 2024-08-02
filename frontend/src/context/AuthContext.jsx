import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { userLG: action.payload }
    case 'LOGOUT':
      return { userLG: null }
    case 'UPDATE_PROFILE_IMAGE':
      return {
        ...state,
        userLG: {
          ...state.userLG,
          profileImage: action.payload
        }
      }
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

  useEffect(() => {
    if (state.userLG) {
      localStorage.setItem('userLG', JSON.stringify(state.userLG))
    }
  }, [state.userLG])

  console.log('AuthContext state:', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
