import { createContext, useReducer } from 'react'

export const EmailsContext = createContext()

export const emailsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EMAILS':
            return {
                emails: action.payload
            }
        case 'SET_EMAILS_AGENT':
            return {
                emails: action.payload
            }
        case 'CREATE_EMAIL':
            return {
                emails: [action.payload, ...state.emails]
            }
        case 'DELETE_EMAIL':
            return {
                emails: state.emails.filter((e) => e._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const EmailsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(emailsReducer, {
        emails: []
    })

    return (
        <EmailsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </EmailsContext.Provider>
    )
}