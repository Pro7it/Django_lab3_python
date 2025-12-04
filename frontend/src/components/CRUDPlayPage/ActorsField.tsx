import { Typography, Select } from "antd";
import { useEffect, useState } from "react";
import { colors } from "../../config";
import { getQuery } from "../../utils/RestUtils";
import type { Actor, Play } from "../../utils/ApiDtos";
import { usePlayState } from "../../utils/StateManager";
import { useDebouncedUpdate } from "./NameField";
import { objA2numA } from "../../utils/FormPlayData";

const ActorsField: React.FC = () => {
    const [_actors, _setActors] = useState<Actor[]>([]);
    const changeField = usePlayState(s => s.changeFiled)
    const setChanged = usePlayState(s => s.setChanged)

    const actors = usePlayState(s => s.data?.actors)
    const lastSaved = usePlayState(s => s.savedData?.actors)
    const [localValue, setLocalValue] = useState(actors ?? []);


    const debouncedUpdateGlobal = useDebouncedUpdate((value: Play["actors"]) => {
        changeField("actors", value);
        setChanged("actors", value !== lastSaved);
    });

    useEffect(() => {
        if (actors !== localValue) setLocalValue(actors ?? []);
    }, [actors]);

    useEffect(() => {
        getQuery("api/actors").then((e) => {
            if (e) _setActors(e as Actor[]);
        });
    }, []);

    return (
        <div
            style={{
                alignItems: "start",
                display: "inline-flex",
                flexDirection: "column",
            }}
        >
            <Typography
                style={{
                    wordBreak: "revert",
                    color: colors["primary-txt"] + "99",
                }}
                children="Актори:"
            />

            <Select
                placeholder="тикни тут"
                popupMatchSelectWidth={false}
                menuItemSelectedIcon={false}
                showSearch={false}
                suffixIcon={null}
                variant="borderless"
                mode="multiple"
                value={objA2numA(localValue, "actor_id")}
                onChange={v => {
                    setLocalValue(v)
                    debouncedUpdateGlobal(v)
                }}
                style={{ width: "min-content", padding: 0 }}
                styles={{ popup: { root: { width: "fit-content" } } }}
            >
                {_actors.map(a => (
                    <Select.Option key={a.actor_id} value={a.actor_id}>
                        <Typography style={{ width: "max-content" }}>
                            {a.name}
                        </Typography>
                    </Select.Option>
                ))}
            </Select>
        </div>
    );
};

export default ActorsField;
