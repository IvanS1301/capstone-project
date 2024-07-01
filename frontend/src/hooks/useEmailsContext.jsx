import { EmailsContext } from "../context/EmailsContext"
import { useContext } from "react"

export const useEmailsContext = () => {
    const context = useContext(EmailsContext)

    if (!context) {
        throw Error('useEmailsContext must be used inside an EmailsContextProvider')
    }

    return context
}