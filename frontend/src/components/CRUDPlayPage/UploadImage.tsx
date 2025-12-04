import { Button, Popover, Space, Tooltip, Typography } from "antd";
import { colors } from "../../config";
import { FloatingButton } from "../FloatingButton";
import { FileImageFilled } from "@ant-design/icons";
import { useRef, useState } from "react";
import { usePlayState } from "../../utils/StateManager";


const UploadImage = () => {
    const [open, setOpen] = useState<boolean>(false)
    const changeField = usePlayState(s => s.changeFiled)
    const uploadRef = useRef<HTMLInputElement>(null)
    const image = usePlayState(s => s.data?.image)

    return <Popover
        open={open}
        onOpenChange={(v) => setOpen(v)}
        styles={{ body: { borderRadius: 16 } }}
        trigger="click"
        content={<Space direction="vertical" size={0}>
            {image ? <Button
                className="btn-hover"
                onClick={() => changeField("image", null)}
                style={{ backgroundColor: colors.primary }}
                variant="filled"
                type="link"
                shape="round"
                color="red"
                children="видалити фото" /> :
                <Button
                    className="btn-hover"
                    onClick={() => uploadRef.current?.click()}
                    style={{ backgroundColor: colors.primary }}
                    variant="filled"
                    type="link"
                    shape="round"
                    color="pink"
                    children="додати фото" />}
        </Space>}>

        <div>
            <Tooltip open={open ? false : undefined} trigger={"hover"} title={<Typography style={{ color: colors.primary, cursor: "default" }}>дії з фото</Typography>}>
                <div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            changeField("image", file ?? null)
                        }}
                        style={{ display: "none", position: "absolute", zIndex: -100 }}
                        ref={uploadRef}
                    />
                    <FloatingButton
                        inContainer
                        Icon={FileImageFilled}
                        onClick={() => { }}
                        style={{
                            fontSize: 24,
                            color: colors["primary-txt"] + "79",
                        }}
                        props={{ className: "animated-icon-self-accent" }}
                    >
                    </FloatingButton>
                </div>
            </Tooltip>
        </div>
    </Popover>
}

export default UploadImage