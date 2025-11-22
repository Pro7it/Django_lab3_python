import type React from "react";
import { useEffect, useState } from "react";
import { getQuery, postQuery } from "../utils/RestUtils";
import { EmptyPlay, type Genre, type Play } from '../utils/ApiDtos';
import { Button, message, Select, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { colors } from "../config";
import { ClockCircleOutlined, LeftCircleFilled } from "@ant-design/icons";
import { changeField, changeTime, checkAllFilled } from "../utils/HookFolders";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Containers";
import EditableField from "../components/EditableField";
import { duration2str } from "../utils/DurationUtils";

const PlayCreatePage: React.FC = () => {
    const [data, setData] = useState<Play>(EmptyPlay)
    const [messageApi, contextHolder] = message.useMessage();
    const [genres, setGenres] = useState<Genre[]>([])
    const navigate = useNavigate()

    const except = ["actors", "directors", "play_id"]

    const handleCreate = () => {
        if (data) {
            const Data = {
                ...data,
                genre_id: typeof data.genre === "number" ? data.genre : data.genre.genre_id,
                actor_ids: data.actors,
                director_ids: data.directors,

            }
            if (checkAllFilled(data, EmptyPlay, except)) {
                postQuery(`api/plays/`, Data).then(r => r ? (setData(EmptyPlay), messageApi.success("succesfully saved!", 0.5)) : messageApi.error("error ocurred", 0.5))
            }
        }
    }

    useEffect(() => {
        getQuery(`api/genres`).then(e => {
            if (e) {
                setGenres(e as Genre[])
            }
        })
    }, [])

    return <>
        {contextHolder}
        <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate(-1)} />
        <Container containerSize="fullwindow" template="outer">
            <Container template="inner" containerSize="compact" props={{ style: { justifyItems: "start", paddingTop: 0 } }}>
                {/* title */}
                <EditableField size="h1" textarea={{
                    placeholder: "Назви мене",
                    value: data.name,
                    onChange: v => changeField(v.currentTarget.value, "name", setData),
                }} />
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Space size={0} direction="vertical">
                        <Space size="middle" style={{ alignItems: "start" }}>
                            {/* name */}
                            <Typography>
                                Автор:
                            </Typography>
                            <EditableField size="fixed" textarea={{
                                placeholder: "Я автор",
                                value: data.author,
                                onChange: v => changeField(v.currentTarget.value, "author", setData),
                            }} />
                            {/* duration */}
                            <ClockCircleOutlined style={{
                                fontSize: 20,
                                color: colors["primary-txt"],
                            }} />
                            <EditableField size="fixed" textarea={{
                                value: duration2str(data.duration),
                                onChange: v => changeTime(v, setData),
                            }} />
                        </Space>
                        <Space size={0}>
                            {/* Genre */}
                            <Typography>
                                Жанр:
                            </Typography>
                            <Select className="select-edit"
                                placeholder="обрати"
                                suffixIcon={false}
                                popupMatchSelectWidth={false}
                                options={genres?.map(genre => ({ value: genre.genre_id, label: <Typography>{genre.name}</Typography> }))}
                                value={(typeof data.genre) == "number" ? (data.genre == 0 ? undefined : data.genre) : data.genre.genre_id}
                                onChange={v => {
                                    if ((typeof data.genre) == "number") {
                                        changeField(v, "genre", setData)
                                    } else if (genres) {
                                        changeField(genres.filter(g => g.genre_id == v)[0], "genre", setData)
                                    }
                                }} variant="borderless"
                                style={{
                                    width: "fit-content",
                                    padding: 0
                                }}
                            />
                        </Space>
                    </Space>
                    <EditableField textarea={{
                        placeholder: "Опиши мене",
                        value: data.description,
                        onChange: v => changeField(v.currentTarget.value, "description", setData),
                    }} />

                </Space>
                {checkAllFilled(data, EmptyPlay, except) && <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
                    <Button color="pink" variant="solid" shape="round" onClick={handleCreate} children="Зберегти" />
                </Space>}
            </Container>
        </Container>
    </>
}

export default PlayCreatePage;
