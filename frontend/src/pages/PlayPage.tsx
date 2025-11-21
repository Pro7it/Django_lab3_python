import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuery, getQuery, putQuery } from "../utils/RestUtils";
import { type Genre, type Play } from '../utils/DtoUtils';
import { Button, message, Select, Space, Typography } from "antd";
import BackButton from "./components/BackButton";
import { colors } from "../config";
import { ClockCircleOutlined, DeleteFilled } from "@ant-design/icons";
import { changeField } from "../utils/HookFoldUtils";
import EditableField from "./components/EditableField";
import type { MessageInstance } from "antd/es/message/interface";
import CardContainer from "./components/Containers";

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hoursPart = `${hours} год`
  const minsPart = `${mins} хв`

  return [hoursPart, minsPart].filter(Boolean).join(' ');
}

function parseTimeString(str: string) {
  const match = str.match(/^(\d*)\s*год\s*(\d*)\s*хв$/);

  if (!match) return null;

  let hours = parseInt(match[1].slice(0, 2), 10);
  let minutes = parseInt(match[2].slice(0, 2), 10);
  if (minutes > 59) {
    minutes = 59
  }
  if (Number.isNaN(minutes)) {
    minutes = 0
  }
  if (Number.isNaN(hours)) {
    hours = 0
  }

  return [hours, minutes];
}


const DeletePlayButton: React.FC<{ id: number, messageApi: MessageInstance }> = ({ id, messageApi }) => {
  const navigate = useNavigate()

  return <div className="animated-icon"
    style={{
      zIndex: 2,
      position: "absolute",
      right: "24px",
      top: "12px",
      fontSize: "24px",
      color: colors["accent"] + "66",
    }}
    onClick={() => deleteQuery(`api/plays/${id}/`).then(r => { r ? (messageApi.success("deleted!", 1).then(() => navigate(-1))) : messageApi.error("error ocurred", 0.5) })}>
    <DeleteFilled className="animated-icon-self" style={{ transition: "100ms" }} />
  </div>
}


const PlayPage: React.FC = () => {
  const params = useParams<{ playid: string }>();
  const [data, setData] = useState<Play | null>(null)
  const [messageApi, contextHolder] = message.useMessage();
  const [genres, setGenres] = useState<Genre[] | null>(null)
  const [isChanged, setChanged] = useState<boolean>(false)




  const navigate = useNavigate()
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


  const saveFields = () => {
    if (data) {
      const Data = {
        ...data,
        genre_id: typeof data.genre === "number" ? data.genre : data.genre.genre_id,
        actor_ids: [],
        director_ids: [],
      }
      putQuery(`api/plays/${Data.play_id}/`, Data).then(r => r ? (setChanged(false), messageApi.success("succesfully saved!", 0.5)) : messageApi.error("error ocurred", 0.5))
    }
  }

  return <>
    {contextHolder}
    <BackButton />
    <CardContainer outerSize="fullsize" innerSpace={{
      style: {
        position: "relative",
      }
    }}>

      {data ? <>
        <DeletePlayButton id={data.play_id} messageApi={messageApi} />
        <EditableField size="h1" textarea={{
          value: data.name,
          onChange: v => (changeField(v.currentTarget.value, "name", setData), setChanged(true))
        }} />
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space size={0} direction="vertical">
            <Space id="author-duration" size="middle">
              <Space style={{ alignItems: "start" }}>
                <Typography>
                  Автор:
                </Typography>
                <EditableField size="fixed" textarea={{
                  value: data.author,
                  onChange: v => (changeField(v.currentTarget.value, "author", setData), setChanged(true)),
                }} />
              </Space>
              <Space>
                <ClockCircleOutlined style={{
                  fontSize: 20,
                  color: colors["primary-txt"],
                }} />
                <Space size={0} wrap style={{ alignContent: "start", width: "fit-content" }}>
                </Space>
                <EditableField size="fixed" textarea={{
                  value: formatMinutes(data.duration),
                  onChange: v => {
                    const time = parseTimeString(v.currentTarget.value)
                    if (time) {
                      const inputEl = v.currentTarget
                      const curpos = inputEl.selectionStart || 0
                      changeField(time[0] * 60 + time[1], "duration", setData)
                      setTimeout(() => {
                        inputEl.setSelectionRange(curpos, curpos)
                        setChanged(true)
                      }, 0)
                    }
                  },
                }} />
              </Space>
            </Space>
            <Space size={0}>
              <Typography>
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
          {data ? <Button color="pink" variant="solid" shape="round" onClick={saveFields}>
            Зберегти
          </Button> : null}
        </Space> : null}
      </> : null}
    </CardContainer>

  </>
}

export default PlayPage;
