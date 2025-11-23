import type React from "react"
import type { PropsWithChildren } from "react"
import { Space, type SpaceProps } from "antd"
import { colors } from "../config"


export const ContainerStyles: {
    template: {
        outer: React.CSSProperties,
        inner: React.CSSProperties,
    },
    containerSize: {
        compact: React.CSSProperties,
        fullsize: React.CSSProperties,
        fullwindow: React.CSSProperties,
    },
} = {
    template: {
        outer: {
            columnGap: 0,
            justifyContent: "center",
            // alignContent: "center",
            // justifyItems: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
        },
        inner: {
            padding: 32,
            borderRadius: 32,
            backgroundColor: colors.secondary,
        },
    },
    containerSize: {
        compact: {
            width: "fit-content",
            // height: "100%",
        },
        fullsize: {
            width: "100%",
            height: "100%",
        },
        fullwindow: {
            width: "100dvw",
            height: "100%",
        },
    },
}

export interface CardContainerProps {
    containerSize?: "compact" | "fullsize" | "fullwindow",
    template?: "outer" | "inner"
    props?: SpaceProps
}

export const Container: React.FC<PropsWithChildren<CardContainerProps>> = ({
    containerSize = "compact",
    template = "outer",
    props,
    children
}) => {
    return <Space
        size={0}
        direction="vertical"
        {...props}

        style={{
            ...ContainerStyles.template[template],
            ...ContainerStyles.containerSize[containerSize],
            ...props?.style,
        }}>
        {children}
    </Space>
}
