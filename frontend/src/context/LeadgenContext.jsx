import { createContext, useReducer } from 'react'

export const LeadgenContext = createContext()

export const leadsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LEADS':
            return {
                ...state,
                leads: action.payload
            }
        case 'CREATE_LEAD':
            return {
                ...state,
                leads: [action.payload, ...state.leads]
            }
        case 'DELETE_LEAD':
            return {
                ...state,
                leads: state.leads.filter((l) => l._id !== action.payload._id)
            }
        case 'UPDATE_LEAD':
            return {
                ...state,
                leads: state.leads.map((lead) =>
                    lead._id === action.payload._id ? action.payload : lead
                )
            }
        default:
            return state
    }
}

export const LeadgenContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(leadsReducer, {
        leads: []
    })

    return (
        <LeadgenContext.Provider value={{ ...state, dispatch }}>
            {children}
        </LeadgenContext.Provider>
    )
}