import { Space, type SpaceProps } from "antd"
import type { PropsWithChildren } from "react"

export const floatDefaultStyle: React.CSSProperties = {
    zIndex: 2,
    position: "absolute",
    left: 16,
    top: 16,
}


export const FloatingContainer: React.FC<PropsWithChildren<{
    style?: React.CSSProperties,
    space?: SpaceProps
}>> = ({ children, style, space }) => {

    return <Space direction="horizontal" size="middle" {...space} style={{
        ...floatDefaultStyle,
        ...style
    }} >
        {children}
    </Space>
}