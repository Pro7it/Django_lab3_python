import type React from "react"
import type { PropsWithChildren } from "react"
import { Space, type SpaceProps } from "antd"
import { colors } from "../config"
import type * as CSS from 'csstype';

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
    div: {
        default: React.CSSProperties,
    }
} = {
    template: {
        outer: {
            columnGap: 0,
            justifyContent: "center",
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
    div: {
        default: {
            display: "inline-flex",
        }
    }
}

export interface CardContainerProps<T extends "div" | "space"> {
    containerSize?: "compact" | "fullsize" | "fullwindow"
    template?: "outer" | "inner"
    direction?: "vertical" | "horizontal",
    renderItem?: T
    props?: T extends "space" ? SpaceProps : React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

export const Container = <T extends "space" | "div">(
    {
        containerSize = "compact",
        template = "outer",
        props,
        children,
        renderItem = "space" as T,
        direction = "vertical"
    }: PropsWithChildren<CardContainerProps<T>>
) => {
    return renderItem ? <Space
        size={0}
        direction={direction}
        {...props}

        style={{
            ...ContainerStyles.template[template],
            ...ContainerStyles.containerSize[containerSize],
            ...props?.style,
        }}>
        {children}
    </Space> : <div {...props} style={{
        flexDirection: direction as CSS.Property.FlexDirection,
        ...ContainerStyles.template[template],
        ...ContainerStyles.containerSize[containerSize],
        ...ContainerStyles.div.default,
        ...props?.style,
    }}>

    </div>
}