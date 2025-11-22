import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuery, getQuery, putQuery } from "../utils/RestUtils";
import { type Genre, type Play } from '../utils/ApiDtos';
import { Button, Select, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { colors } from "../config";
import { ClockCircleOutlined, DeleteFilled, LeftCircleFilled } from "@ant-design/icons";
import { changeField, changeTime } from "../utils/HookFolders";
import EditableField from "../components/EditableField";
import { Container } from "../components/Containers";
import { useMessage } from "../utils/StateManager";
import { duration2str } from "../utils/DurationUtils";

const PlayPage: React.FC = () => {
  const params = useParams<{ playid: string }>();
  const [data, setData] = useState<Play | null>(null)
  const messageApi = useMessage(s => s.messageApi)
  const [genres, setGenres] = useState<Genre[] | null>(null)
  const [isChanged, setChanged] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleDelete = (id: number) => deleteQuery(`api/plays/${id}/`).then(r => r ? (messageApi?.success("deleted!", 1).then(() => navigate(-1)), null) : messageApi?.error("error ocurred", 0.5))


  const handleSave = () => {
    if (data) {
      const Data = {
        ...data,
        genre_id: typeof data.genre === "number" ? data.genre : data.genre.genre_id,
        actor_ids: [],
        director_ids: [],
      }
      putQuery(`api/plays/${Data.play_id}/`, Data).then(r => r ? (setChanged(false), messageApi?.success("succesfully saved!", 0.5)) : messageApi?.error("error ocurred", 0.5))
    }
  }


  useEffect(() => {
    getQuery(`api/plays/${params.playid}`).then(e => {
      if (e) {
        setData(e as Play)
      } else {
        navigate("/error")
      }
    })
    getQuery(`api/genres`).then(e => {
      if (e) {
        setGenres(e as Genre[])
      }
    })
  }, [params.playid, navigate])

  return <>
    <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate(-1)} />
    <Container template="outer" containerSize="fullsize">
      <Container template="inner" containerSize="compact" props={{ style: { paddingTop: 16, position: "relative" } }}>
        {data ? <>
          <FloatingButton 
          Icon={DeleteFilled} 
          onClick={() => handleDelete(data.play_id)} 
          style={{
            left: undefined,
            right: 24,
            top: 12,
            fontSize: 24,
            color: colors["accent"] + "66",
          }} />
          {/* title */}
          <EditableField size="h1" textarea={{
            value: data.name,
            onChange: v => (changeField(v.currentTarget.value, "name", setData), setChanged(true))
          }} />
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space size={0} direction="vertical">
              <Space size="middle" style={{ alignItems: "start" }}>
                {/* name */}
                <Typography style={{ color: colors["primary-txt"] + "99" }}>
                  Автор:
                </Typography>
                <EditableField size="fixed" textarea={{
                  value: data.author,
                  onChange: v => (changeField(v.currentTarget.value, "author", setData), setChanged(true)),
                }} />
                {/* duration */}
                <ClockCircleOutlined style={{
                  fontSize: 20,
                  color: colors["primary-txt"] + "99",
                }} />
                <EditableField size="fixed" textarea={{
                  value: duration2str(data.duration),
                  onChange: v => changeTime(v, setData, () => setChanged(true)),
                }} />
              </Space>
              <Space size={0}>
                {/* Genre */}
                <Typography style={{ color: colors["primary-txt"] + "99" }}>
                  Жанр:
                </Typography>
                <Select className="select-edit"
                  suffixIcon={false}
                  popupMatchSelectWidth={false}
                  options={genres ? (genres.map(genre => ({ value: genre.genre_id, label: <Typography>{genre.name}</Typography> }))) : [(((typeof data.genre) == "number") ?
                    { value: data.genre, label: <Typography>{data.genre}</Typography> } :
                    { value: data.genre.genre_id, label: <Typography>{data.genre.name}</Typography> })]}
                  value={(typeof data.genre) == "number" ? data.genre : data.genre.genre_id}
                  onChange={v => {
                    if ((typeof data.genre) == "number") {
                      changeField(v, "genre", setData)
                    } else if (genres) {
                      <Typography></Typography>
                      changeField(genres.filter(g => g.genre_id == v)[0], "genre", setData)
                    }
                    setChanged(true)
                  }} variant="borderless"
                  style={{
                    width: "fit-content",
                    padding: 0
                  }}


                />
              </Space>
            </Space>
            <EditableField textarea={{
              value: data.description,
              onChange: v => (changeField(v.currentTarget.value, "description", setData), setChanged(true)),
            }} />

          </Space>
          {isChanged ? <Space style={{ width: "100%", justifyContent: "center", marginTop: 32 }}>
            {data ? <Button color="pink" variant="solid" shape="round" onClick={handleSave}>
              Зберегти
            </Button> : null}
          </Space> : null}
        </> : null}
      </Container>
    </Container>

  </>
}

export default PlayPage;
