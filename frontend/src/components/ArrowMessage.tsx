import { colors } from "../config"
import { Container, type CardContainerProps } from "./Containers"
import Icon, { type IconProps } from "./Icon"
import { useEffect, useRef, type ReactNode } from "react"
import { createDraggable, createScope, Scope, spring } from "animejs"


export type ArrowMessageProps = {
    arrow1Prop?: React.SVGProps<SVGPathElement>,
    arrow2Prop?: React.SVGProps<SVGPathElement>,
    fullElementProp?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    message?: ReactNode,
    fullArrowProp?: Omit<IconProps, "path">
    msgContainerProp?: React.PropsWithChildren<CardContainerProps<"space">>,
    refScope: React.RefObject<HTMLDivElement | null>
}

export const ArrowMessage = ({
    arrow1Prop,
    arrow2Prop,
    fullElementProp,
    message,
    msgContainerProp,
    refScope,
    fullArrowProp
}: ArrowMessageProps) => {
    const refNote3 = useRef<HTMLDivElement>(null);
    const scope = useRef<Scope>(null);


    useEffect(() => {
        const note = refNote3.current;
        if (!note) return;

        scope.current = createScope({ root: refScope }).add(() => {
            createDraggable(note, {
                container: [0.9, 0, 0, 0],
                releaseEase: spring({ bounce: 0.1 }),
                containerFriction: 0.8,
            });
        });

        return () => scope.current?.revert();
    }, [refNote3]);


    return (<div
        className="arrow-message fade-apear"
        ref={refNote3}
        {...fullElementProp}
        style={{ position: "absolute", zIndex: 3, ...fullElementProp?.style }}
    >
        <div style={{ position: "relative" }}>
            <div
                style={{ position: "absolute", ...fullArrowProp?.style }}>
                <Icon
                    path={
                        <g>
                            <path
                                stroke="currentColor"
                                {...arrow1Prop}
                                style={{
                                    strokeWidth: "32px",
                                    ...arrow1Prop?.style
                                }}
                                className="arrow1"
                            />
                            <path
                                stroke="currentColor"
                                {...arrow2Prop}
                                style={{
                                    strokeWidth: "32px",
                                    ...arrow2Prop?.style
                                }}
                                className="arrow2"
                            />
                        </g>
                    }
                    props={{ fill: "none", viewBox: "0 0 512 512" }}
                    {...fullArrowProp}
                    style={{ width: 80, color: colors.arrow }}
                />
            </div>
            <Container
                template="inner"
                containerSize="compact"
                {...msgContainerProp}
                props={{
                    style: {
                        position: "absolute",
                        backgroundColor: colors.arrow,
                        padding: 16,
                        width: "max-content",
                        ...msgContainerProp?.props?.style
                    },
                }}
            >
                {message}

            </Container>
        </div>
    </div >)
}

export default ArrowMessage


