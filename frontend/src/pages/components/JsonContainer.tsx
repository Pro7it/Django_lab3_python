import type React from "react"
import type { ReactNode } from "react"

const JsonContainer: React.FC<{ children?: ReactNode }> = ({ children }) => {

    return (<div style={{
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        padding: 16,
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: "#ff3bb42e",
        borderRadius: 32,
        width: "fit-content"
    }}>
        {children}
    </div>)
}


export default JsonContainer