import { Typography, Select, Space } from "antd";
import { colors } from "../../config";
import { useEffect, useMemo, useState } from "react";
import { getQuery } from "../../utils/RestUtils";
import { checkInvalid, type Genre, type Play } from "../../utils/ApiDtos";
import { usePlayState } from "../../utils/StateManager";
import { useDebouncedUpdate } from "./NameField";
import { obj2num } from "../../utils/FormPlayData";

const GenreField: React.FC = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const changeField = usePlayState(s => s.changeFiled)
    const setValid = usePlayState(s => s.setValid)
    const setChanged = usePlayState(s => s.setChanged)

    const genre = usePlayState(s => s.data?.genre)
    const lastSaved = usePlayState(s => s.savedData?.genre)
    const [localValue, setLocalValue] = useState(genre ?? null);


    const debouncedUpdateGlobal = useDebouncedUpdate((value: Play["genre"]) => {
        changeField("genre", value);
        setChanged("genre", value !== lastSaved);
        setValid("genre", checkInvalid("genre", value));
    });

    useEffect(() => {
        if (genre !== localValue) setLocalValue(genre ?? null);
    }, [genre]);


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
                value={localValue? obj2num(localValue, "genre_id") : null}
                onChange={v=>{
                    setLocalValue(v)
                    debouncedUpdateGlobal(v)
                }}>
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
