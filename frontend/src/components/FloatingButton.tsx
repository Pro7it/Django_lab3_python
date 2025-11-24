import { colors } from "../config"
import type React from "react"
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon"
import { floatDefaultStyle } from "./FloatingContainer"


const defaultFloatBtnStyle: React.CSSProperties = {
    fontSize: "40px",
    color: colors["floating-btn"]
}

export const FloatingButton: React.FC<{
    Icon: React.ForwardRefExoticComponent<Omit<AntdIconProps, "ref"> & React.RefAttributes<HTMLSpanElement>>,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    inContainer?: boolean,
    style?: React.CSSProperties
    props?: AntdIconProps
}> = ({ onClick, style, inContainer, Icon, props }) => {

    const positionStyle: React.CSSProperties = !inContainer ? floatDefaultStyle : { position: "relative" }

    return <div className="animated-icon"
        style={{
            ...defaultFloatBtnStyle,
            ...positionStyle,
            ...style
        }}
        onClick={onClick} >
        <Icon className="animated-icon-self" style={{ transition: "100ms" }} {...props} />
    </div>
}