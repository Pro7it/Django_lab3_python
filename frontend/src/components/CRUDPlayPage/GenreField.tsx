import { Typography, Select, Space } from "antd";
import { colors } from "../../config";
import { useMemo, useState } from "react";
import { getQuery } from "../../utils/RestUtils";
import type { Genre } from "../../utils/ApiDtos";

interface GenreFieldProps {
    value: number;
    onChange: (values: number) => void;
}


const GenreField: React.FC<GenreFieldProps> = ({ value, onChange }) => {
    const [genres, setGenres] = useState<Genre[]>([]);

    useMemo(() => {
        getQuery(`api/genres`).then((e) => {
            if (e) setGenres(e as Genre[]);
        });
    }, [])

    return (
        <Space size={0}>
            <Typography
                style={{ color: colors["primary-txt"] + "99" }} children="Жанр:" />
            <Select
                placeholder="Тикни тут"
                className="select-edit"
                suffixIcon={false}
                popupMatchSelectWidth={false}
                variant="borderless"
                style={{ width: "fit-content", padding: 0 }}
                value={value}
                onChange={onChange}>
                {genres.map(genre => (
                    <Select.Option key={genre.genre_id} value={genre.genre_id}>
                        {genre.name}
                    </Select.Option>
                ))}
            </Select>
        </Space>
    );
};

export default GenreField;
