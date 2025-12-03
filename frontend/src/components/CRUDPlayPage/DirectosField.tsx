import { Typography, Select } from "antd";
import { useEffect, useState } from "react";
import { colors } from "../../config";
import { getQuery } from "../../utils/RestUtils";
import type { Director } from "../../utils/ApiDtos";

interface DirectosFieldProps {
    value: number[];               // масив id акторів
    onChange: (ids: number[]) => void;
}

const DirectosField: React.FC<DirectosFieldProps> = ({ value, onChange }) => {
    const [directors, setDirectors] = useState<Director[]>([]);

    useEffect(() => {
        getQuery("api/directors").then((e) => {
            if (e) setDirectors(e as Director[]);
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
                value={value}
                onChange={onChange}
                style={{ width: "min-content", padding: 0 }}
                styles={{ popup: { root: { width: "fit-content" } } }}
            >
                {directors.map(a => (
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
