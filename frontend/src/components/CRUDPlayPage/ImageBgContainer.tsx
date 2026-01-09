import type { PropsWithChildren } from "react";
import type React from "react";
import { Container } from "../Containers";
import { usePlayState } from "../../utils/StateManager";

const ImageBgContainer: React.FC<PropsWithChildren<{ refScope?: React.Ref<HTMLDivElement> }>> = ({ children, refScope }) => {
    const image = usePlayState(s => s.data?.image)

    const bgUrl = image ? (image instanceof File
        ? URL.createObjectURL(image)
        : image) : null

    return <Container
        renderItem="div"
        props={{
            ref: refScope,
            style: {
                overflow: "hidden",
                // backgroundImage: data?.image ? `url(${data.image})` : undefined,
                backgroundImage: bgUrl ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgUrl})` : undefined,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            },
        }}
        template="outer"
        containerSize="fullsize"
        children={children}
    />
}

export default ImageBgContainer