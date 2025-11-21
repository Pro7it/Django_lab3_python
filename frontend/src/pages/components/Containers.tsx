import type React from "react"
import type { PropsWithChildren } from "react"
import { Space, type SpaceProps } from "antd"
import { colors } from "../../config"


const CardStyles: {
    space: {
        default: React.CSSProperties,
        compact: React.CSSProperties,
        fullsize: React.CSSProperties,
        fullwindow: React.CSSProperties,
        fixed: React.CSSProperties,
    },
    innerSpace: {
        default: React.CSSProperties,
        compact: React.CSSProperties,
        fixed: React.CSSProperties,
        fullsize: React.CSSProperties,
    }
} = {
    space: {
        default: {
            columnGap: 0,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: colors.primary,
        },
        compact: {
            width: "fit-content",
            // height: "100%",
        },
        fixed: {
            // width: "100%",
            // height: "100%",
        },
        fullsize: {
            width: "100%",
            height: "100%",
        },
        fullwindow: {
            width: "100dvw",
            // height: "100%",
        },
    },
    innerSpace: {
        default: {
            padding: 32,
            paddingTop: 0,
            paddingBottom: 24,
            borderRadius: 32,
            backgroundColor: colors.secondary,
        },
        compact: {
            width: "fit-content",
            // height: "100%",
        },
        fixed: {
            // width: "100%",
            // height: "100%",
        },
        fullsize: {
            width: "100%",
        }
    },

}

export interface CardContainerProps {
    outerSize?: "compact" | "fullsize" | "fullwindow" | "fixed",
    innerSize?: "compact" | "fixed" | "fullsize",
    space?: SpaceProps,
    innerSpace?: SpaceProps
}

const CardContainer: React.FC<PropsWithChildren<CardContainerProps>> = ({
    outerSize = "compact",
    innerSize = "compact",
    space,
    innerSpace,
    children
}) => {
    const { wrap = false } = space ? space : {}
    const { size = 0, direction = "vertical" } = innerSpace ? innerSpace : {}
    return <Space
        wrap={wrap}
        {...space}
        style={{
            ...CardStyles.space.default,
            ...CardStyles.space[outerSize],
            ...space?.style,
        }}>
        <Space
            {...innerSpace}
            size={size}
            direction={direction}

            style={{
                ...CardStyles.innerSpace.default,
                ...CardStyles.innerSpace[innerSize],
                ...innerSpace?.style,
            }}>
            {children}
        </Space>
    </Space>
}

export default CardContainer