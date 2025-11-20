import type React from "react"
import { colors } from "../../config"
import Input from "antd/es/input"
import type { PropsWithChildren } from "react"
import { Space, type SpaceProps } from "antd"


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

export interface CardContainerProps {
    size?: "compact" | "fullsize" | "fullwindow" | "fixed",
    innerSize?: "compact" | "fixed",
    space?: SpaceProps,
    innerSpace?: SpaceProps
}

//TODO
const CardContainer: React.FC<PropsWithChildren<CardContainerProps>> = ({
    size = "compact",
    innerSize = "compact",
    space,
    innerSpace,
    children
}) => {
    const { } = space? space : {}
    const { } = innerSpace? innerSpace : {}
    return <Space>
        <Space>{children}</Space>
    </Space>
}

export default CardContainer