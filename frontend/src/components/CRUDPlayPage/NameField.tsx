import React, { useEffect, useState } from "react";
import EditableField from "../EditableField";
import { usePlayState } from "../../utils/StateManager";


import { useRef, useMemo } from "react";
import { checkInvalid } from "../../utils/ApiDtos";

export function useDebouncedUpdate<T extends (...args: any[]) => void>(fn: T, delay: number = 200) {
    const timer = useRef<number | null>(null);

    return useMemo(() => {
        return (...args: Parameters<T>) => {
            if (timer.current !== null) {
                clearTimeout(timer.current);
            }
            timer.current = window.setTimeout(() => fn(...args), delay);
        };
    }, [fn, delay]);
}



const NameField: React.FC = () => {
    const changeField = usePlayState(s => s.changeFiled)
    const setValid = usePlayState(s => s.setValid)
    const setChanged = usePlayState(s => s.setChanged)

    const name = usePlayState(s => s.data?.name)
    const lastSaved = usePlayState(s => s.savedData?.name)
    const [localValue, setLocalValue] = useState(name ?? "");


    const debouncedUpdateGlobal = useDebouncedUpdate((value: string) => {
        changeField("name", value);
        setChanged("name", value !== lastSaved);
        setValid("name", checkInvalid("name", value));
    })

    useEffect(() => {
        if (name !== localValue) setLocalValue(name ?? "");
    }, [name]);

    return (
        <EditableField
            size="h1"
            textarea={{
                placeholder: "Назва шедевру",
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

export default NameField;
