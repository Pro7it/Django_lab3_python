import { Typography, Select } from "antd";
import { useEffect, useState } from "react";
import { colors } from "../../config";
import { getQuery } from "../../utils/RestUtils";
import { type Director, type Play } from "../../utils/ApiDtos";
import { usePlayState } from "../../utils/StateManager";
import { useDebouncedUpdate } from "./NameField";
import { objA2numA } from "../../utils/FormPlayData";

const DirectosField: React.FC = () => {
    const [_directors, _setDirectors] = useState<Director[]>([]);
    const changeField = usePlayState(s => s.changeFiled)
            const setChanged = usePlayState(s => s.setChanged)
        
            const directors = usePlayState(s => s.data?.directors)
            const lastSaved = usePlayState(s => s.savedData?.directors)
            const [localValue, setLocalValue] = useState(directors ?? []);
        
        
            const debouncedUpdateGlobal = useDebouncedUpdate((value: Play["directors"]) => {
                changeField("directors", value);
                setChanged("directors", value !== lastSaved);
            });
        
            useEffect(() => {
                if (directors !== localValue) setLocalValue(directors ?? []);
            }, [directors]);

    useEffect(() => {
        getQuery("api/directors").then((e) => {
            if (e) _setDirectors(e as Director[]);
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
                children="Продюсери:"
            />

            <Select
                placeholder="тикни тут"
                popupMatchSelectWidth={false}
                menuItemSelectedIcon={false}
                showSearch={false}
                suffixIcon={null}
                variant="borderless"
                mode="multiple"
                value={objA2numA(localValue, "director_id")}
                onChange={v => {
                    setLocalValue(v)
                    debouncedUpdateGlobal(v)
                }}
                style={{ width: "min-content", padding: 0 }}
                styles={{ popup: { root: { width: "fit-content" } } }}
            >
                {_directors.map(a => (
                    <Select.Option key={a.director_id} value={a.director_id}>
                        <Typography style={{ width: "max-content" }}>
                            {a.name}
                        </Typography>
                    </Select.Option>
                ))}
            </Select>
        </div>
    );
};

export default DirectosField;
