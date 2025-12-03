import ArrowMessage, { type ArrowMessageProps } from "./ArrowMessage"
import { arrow1_1, arrow1_2, arrow2_1, arrow2_2, arrow3_1, arrow3_2 } from "../utils/IconPaths"
import { Typography } from "antd"
import { colors } from "../config"


export const PlayArrowMessageGeneralWarning = ({
    refScope, message
}: Pick<ArrowMessageProps, "refScope" | "message">) => {

    return <ArrowMessage
        refScope={refScope}
        fullElementProp={{ style: { left: 0, top: 0, right: 250 } }}
        fullArrowProp={{ style: { right: 0, bottom: 0, rotate: "25deg" } }}
        arrow1Prop={{
            d: arrow3_1,
            style: { animationDuration: "2000ms" }
        }}
        arrow2Prop={{
            d: arrow3_2,
            style: { animationDuration: "0ms", animationDelay: "1900ms" }
        }}
        msgContainerProp={{
            props: {
                style: {
                    left: 140,
                    bottom: 70,
                    minWidth: 160,
                    rotate: "-5deg",
                }
            }
        }}
        message={message}

    />
}

export const PlayArrowMessageTimeWarning = ({
    refScope
}: Pick<ArrowMessageProps, "refScope">) => {

    return <ArrowMessage
        refScope={refScope}
        fullElementProp={{
            style: { right: -45, top: 80 }
        }}
        fullArrowProp={{
            style: { right: 0, bottom: 0, rotate: "20deg" }, props: {
                fill: "none",
                viewBox: "0 0 100 100",
            }
        }}
        arrow1Prop={{
            d: arrow1_1,
            style: { animationDuration: "5900ms", animationDelay: "500ms", strokeWidth: "5px" }
        }}
        arrow2Prop={{
            d: arrow1_2,
            style: { animationDuration: "3300ms", animationDelay: "900ms", strokeWidth: "5px" }
        }}
        msgContainerProp={{
            props: {
                style: { left: -50, bottom: 50, minWidth: 160, rotate: "10deg", width: undefined }
            }
        }}
        message={<Typography style={{ color: colors.primary }}>
            вистави не тривають 0 хв! 🙄 🕓
        </Typography>}

    />
}

export const PlayArrowMessageAuthorWarning = ({
    refScope
}: Pick<ArrowMessageProps, "refScope">) => {

    return <ArrowMessage
        refScope={refScope}
        fullElementProp={{ style: { left: -65, top: 50, } }}
        fullArrowProp={{ style: { right: 0, bottom: 0, rotate: "20deg" } }}
        arrow1Prop={{
            d: arrow2_2,
            style: { animationDuration: "3300ms", animationDelay: "0ms" }
        }}
        arrow2Prop={{
            d: arrow2_1,
            style: { animationDuration: "0ms", animationDelay: "1500ms" }
        }}
        msgContainerProp={{
            props: {
                style: { right: 20, bottom: 80, minWidth: 160, rotate: "10deg", width: undefined }
            }
        }}
        message={<Typography style={{ color: colors.primary }}>
            а хто автор цього шедевру? 🤔🤔🤔
        </Typography>}

    />
}