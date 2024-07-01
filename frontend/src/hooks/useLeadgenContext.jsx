import { LeadgenContext } from "../context/LeadgenContext"
import { useContext } from "react"

export const useLeadgenContext = () => {
    const context = useContext(LeadgenContext)

    if (!context) {
        throw Error('useLeadgenContext must be used inside an LeadgenContextProvider')
    }

    return context
}