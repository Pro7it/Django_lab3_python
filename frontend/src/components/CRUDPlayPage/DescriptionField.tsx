import React, { useEffect, useState } from "react";
import EditableField from "../EditableField";
import { usePlayState } from "../../utils/StateManager";
import { useDebouncedUpdate } from "./NameField";

const DescriptionField: React.FC = () => {
    const changeField = usePlayState(s => s.changeFiled)
    const setValid = usePlayState(s => s.setValid)
    const setChanged = usePlayState(s => s.setChanged)

    const description = usePlayState(s => s.data?.description)
    const lastSaved = usePlayState(s => s.savedData?.description)
    const [localValue, setLocalValue] = useState(description ?? "");


    const debouncedUpdateGlobal = useDebouncedUpdate((value: string) => {
        changeField("description", value);
        setChanged("description", value !== lastSaved);
        setValid("description", value === "");
    });

    useEffect(() => {
        if (description !== localValue) setLocalValue(description ?? "");
    }, [description]);


    return (
        <EditableField
            textarea={{
                placeholder: "хмм.. А про що це?",
                value: localValue,
                onChange: (e) => {
                    const value = e.currentTarget.value;
                    setLocalValue(value);
                    debouncedUpdateGlobal(value);
                },
            }}
        />
    );
};

export default DescriptionField;
