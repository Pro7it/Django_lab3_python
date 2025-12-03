import { Typography, Select } from "antd";
import { useEffect, useState } from "react";
import { colors } from "../../config";
import { getQuery } from "../../utils/RestUtils";
import type { Actor } from "../../utils/ApiDtos";

interface ActorsFieldProps {
    value: number[];               // масив id акторів
    onChange: (ids: number[]) => void;
}

const ActorsField: React.FC<ActorsFieldProps> = ({ value, onChange }) => {
    const [actors, setActors] = useState<Actor[]>([]);

    useEffect(() => {
        getQuery("api/actors").then((e) => {
            if (e) setActors(e as Actor[]);
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
                value={value}
                onChange={onChange}
                style={{width: "min-content", padding: 0 }}
                styles={{ popup: { root: { width: "fit-content" } } }}
            >
                {actors.map(a => (
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
