import { ClockCircleOutlined } from "@ant-design/icons";
import EditableField from "../EditableField";
import { colors } from "../../config";
import type { ArrowMessageProps } from "../ArrowMessage";
import { PlayArrowMessageTimeWarning } from "./PlayArrows";
import { duration2str, str2duration } from "../../utils/DurationUtils";
import { Space } from "antd";
import { usePlayState } from "../../utils/StateManager";
import { useEffect, useState } from "react";
import { useDebouncedUpdate } from "./NameField";

const DurationField: React.FC<Pick<ArrowMessageProps, "refScope">> = ({ refScope }) => {
    const changeField = usePlayState(s => s.changeFiled)
    const setValid = usePlayState(s => s.setValid)
    const setChanged = usePlayState(s => s.setChanged)

    const duration = usePlayState(s => s.data?.duration)
    const lastSaved = usePlayState(s => s.savedData?.duration)
    const [localValue, setLocalValue] = useState(duration2str(duration ?? 0))


    const debouncedUpdateGlobal = useDebouncedUpdate((time: number) => {
        changeField("duration", time ?? 0);
        setChanged("duration", time !== lastSaved);
        setValid("duration", time <= 0);
    });

    useEffect(() => {
        if (duration !== str2duration(localValue)) setLocalValue(duration2str(duration ?? 0));
    }, [duration]);


    return (
        <Space size="middle" style={{ alignItems: "start" }}>
            <ClockCircleOutlined
                style={{
                    fontSize: 20,
                    color: colors["primary-txt"] + "99",
                }} />

            <div style={{ position: "relative", overflow: "visible" }}>
                <EditableField
                    size="fixed"
                    textarea={{
                        value: localValue,
                        onChange: (e) => {
                            const inputEl = e.currentTarget
                            const curpos = inputEl.selectionStart || 0
                            const time = str2duration(e.currentTarget.value)

                            if (time != null) {
                                setLocalValue(duration2str(time))
                                debouncedUpdateGlobal(time)
                            }

                            setTimeout(() => {
                                inputEl.setSelectionRange(curpos, curpos)
                            }, 0)
                        },
                    }} />
                {duration === 0 && <PlayArrowMessageTimeWarning refScope={refScope} />}
            </div>
        </Space>
    );
};

export default DurationField;
