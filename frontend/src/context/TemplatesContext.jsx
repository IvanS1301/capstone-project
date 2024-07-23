import { createContext, useReducer } from 'react';

export const TemplatesContext = createContext();

export const templatesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TEMPLATES':
            return {
                templates: action.payload
            };
        case 'CREATE_TEMPLATE':
            return {
                templates: [...state.templates, action.payload]
            };
        case 'UPDATE_TEMPLATE':
            return {
                templates: state.templates.map((template) =>
                    template._id === action.payload._id ? action.payload : template
                )
            };
        case 'DELETE_TEMPLATE':
            return {
                templates: state.templates.filter((template) => template._id !== action.payload._id)
            };
        default:
            return state;
    }
};

export const TemplatesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(templatesReducer, {
        templates: []
    });

    return (
        <TemplatesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TemplatesContext.Provider>
    );
};
