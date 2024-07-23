import { TemplatesContext } from "../context/TemplatesContext"
import { useContext } from "react"

export const useTemplateContext = () => {
    const context = useContext(TemplatesContext)

    if (!context) {
        throw Error('useTemplateContext must be used inside an TemplatesContextProvider')
    }

    return context
}
