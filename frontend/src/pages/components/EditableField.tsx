import type React from "react"
import { colors } from "../../config"
import type { TextAreaProps } from "antd/es/input"
import Input from "antd/es/input"


const h1Style: React.CSSProperties = {
    fontSize: 42,
    marginBlockStart: "0.67em",
    marginBlockEnd: " 0.67em",
    marginBottom: "0.5em",
    color: colors["primary-txt"],
    fontWeight: 400,
    lineHeight: 1.1904761904761905,
    padding: 0
}



export interface EditableFieldProps {
    size?: "regular" | 1,
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
            ...textarea.style,
            ...(size === 1 ? h1Style : {})
        }} />
}

export default EditableField