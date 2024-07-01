import { createContext, useReducer } from 'react'

export const ServicesContext = createContext()

export const leadsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LEADGEN_STATS':
            return {
                ...state,
                leadGenStats: action.payload
            }
        case 'SET_BOOKED_UNITS':
            return {
                ...state,
                bookedUnits: action.payload
            }
        default:
            return state
    }
}

export const ServicesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(leadsReducer, {
        leadGenStats: [],
        bookedUnits: []
    })

    return (
        <ServicesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ServicesContext.Provider>
    )
}