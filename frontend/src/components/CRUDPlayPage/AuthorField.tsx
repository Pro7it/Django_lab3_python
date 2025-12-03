import { Space, Typography } from "antd";
import EditableField from "../EditableField";
import { colors } from "../../config";
import { PlayArrowMessageAuthorWarning } from "../PlayArrows";
import type { ArrowMessageProps } from "../ArrowMessage";
import { usePlayState } from "../../utils/StateManager";
import { useEffect, useState } from "react";
import { useDebouncedUpdate } from "./NameField";

const AuthorField: React.FC<Pick<ArrowMessageProps, "refScope">> = ({ refScope }) => {
    const changeField = usePlayState(s => s.changeFiled)
    const setValid = usePlayState(s => s.setValid)
    const setChanged = usePlayState(s => s.setChanged)

    const author = usePlayState(s => s.data?.author)
    const lastSaved = usePlayState(s => s.savedData?.author)
    const [localValue, setLocalValue] = useState(author ?? "");


    const debouncedUpdateGlobal = useDebouncedUpdate((value: string) => {
        changeField("author", value);
        setChanged("author", value !== lastSaved);
        setValid("author", value !== "");
    }, 400);

    useEffect(() => {
        if (author !== localValue) setLocalValue(author ?? "");
    }, [author]);


    return (
        <Space size="middle" style={{ alignItems: "start" }}>
            <Typography style={{ color: colors["primary-txt"] + "99" }}>
                Автор:
            </Typography>
            <div style={{ position: "relative", overflow: "visible" }}>
                <EditableField
                    textarea={{
                        placeholder: "Автор є?",
                        value: localValue,
                        onChange: (e) => {
                            const value = e.currentTarget.value;
                            setLocalValue(value);
                            debouncedUpdateGlobal(value);
                        },
                    }}
                />
                {(localValue === "") && <PlayArrowMessageAuthorWarning refScope={refScope} />}
            </div>
        </Space>
    );
};

export default AuthorField;
