import type React from "react"
import { colors } from "../config"
import type { TextAreaProps } from "antd/es/input"
import Input from "antd/es/input"


const EditableStyles: {
    "regular": React.CSSProperties,
    "h1": React.CSSProperties,
    "fixed": React.CSSProperties,
    "default": React.CSSProperties,
} = {
    default: {
        padding: 0,
    },
    "h1": {
        fontSize: 42,
        marginBlockStart: "0.67em",
        marginBlockEnd: " 0.67em",
        marginBottom: "0.5em",
        color: colors["primary-txt"],
        fontWeight: 400,
        lineHeight: 1.1904761904761905,
    },
    fixed: {
        width: 120,
        lineHeight: 1
    },
    regular: {
        lineHeight: 1
    }
}



export interface EditableFieldProps {
    size?: "regular" | "h1" | "fixed",
    textarea: TextAreaProps
}


const EditableField: React.FC<EditableFieldProps> = ({
    size = "regular",
    textarea
}) => {
    const {
        autoSize = { minRows: 1 },
        variant = "borderless",
    } = textarea
    return <Input.TextArea
        autoSize={autoSize}
        variant={variant} {...textarea}
        style={{
            ...EditableStyles.default,
            ...EditableStyles[size],
            ...textarea.style,
        }} />
}

export default EditableField