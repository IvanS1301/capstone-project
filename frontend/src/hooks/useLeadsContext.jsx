import { LeadsContext } from "../context/LeadsContext"
import { useContext } from "react"

export const useLeadsContext = () => {
  const context = useContext(LeadsContext)

  if(!context) {
    throw Error('useLeadsContext must be used inside an LeadsContextProvider')
  }

  return context
}