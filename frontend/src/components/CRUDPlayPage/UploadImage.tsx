import { Button, Popover, Space, Tooltip, Typography } from "antd";
import { colors } from "../../config";
import { FloatingButton } from "../FloatingButton";
import { FileImageFilled } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { usePlayState } from "../../utils/StateManager";


const UploadImage = () => {
    const [open, setOpen] = useState<boolean>(false)
    const changeField = usePlayState(s => s.changeFiled)
    const setChanged = usePlayState(s => s.setChanged)
    const lastSaved = usePlayState(s => s.savedData?.image)
    const valid = usePlayState(_ => _.valid)
    const isvalid = usePlayState(_ => _.isValid)
    const changed = usePlayState(_ => _.isChanged)


    const uploadRef = useRef<HTMLInputElement>(null)
    const image = usePlayState(s => s.data?.image)

    const handleRemoveImage = () => {
        changeField("image", null)
        setChanged("image", lastSaved != null)
    }

    const handleUploadImage = (file?: File) => {
        changeField("image", file ?? null)
        setChanged("image", true)
        
    }
    
    useEffect(()=>{
        
        console.log(image, valid, changed, isvalid);
    }, [image])

    return <Popover
        open={open}
        onOpenChange={(v) => setOpen(v)}
        styles={{ body: { borderRadius: 16 } }}
        trigger="click"
        content={<Space direction="vertical" size={0}>
            {image ? <Button
                className="btn-hover"
                onClick={handleRemoveImage}
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
                            handleUploadImage(file)
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