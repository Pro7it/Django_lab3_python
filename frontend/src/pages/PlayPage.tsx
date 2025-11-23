import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuery, getQuery, putQuery } from "../utils/RestUtils";
import { type Genre, type Play } from '../utils/ApiDtos';
import { Button, Select, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { colors } from "../config";
import { ClockCircleOutlined, DeleteFilled, LeftCircleFilled, UndoOutlined } from "@ant-design/icons";
import { changeField, changeTime, checkSame } from "../utils/HookFolders";
import EditableField from "../components/EditableField";
import { Container } from "../components/Containers";
import { useMessage } from "../utils/StateManager";
import { duration2str } from "../utils/DurationUtils";
import Icon from "../components/Icon";
import { arrow1_1, arrow1_2 } from "../utils/IconPaths";
import { createDraggable, createScope, spring, Scope } from "animejs";
import { FloatingContainer } from "../components/FloatingContainer";

const PlayPage: React.FC = () => {
  const params = useParams<{ playid: string }>();
  const [data, setData] = useState<Play | null>(null)
  const [lastSavedData, setLastSavedData] = useState<Play | null>(null)
  const messageApi = useMessage(s => s.messageApi)
  const [genres, setGenres] = useState<Genre[] | null>(null)
  const navigate = useNavigate()
  const scope = useRef<Scope>(null)
  const refScope = useRef<HTMLDivElement>(null)
  const refNote = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleDelete = (id: number) => deleteQuery(`api/plays/${id}/`).then(r => r ? (messageApi?.success("deleted!", 1).then(() => navigate(-1)), null) : messageApi?.error("error ocurred", 0.5))


  const handleSave = () => {
    if (data) {
      const Data = {
        ...data,
        genre_id: typeof data.genre === "number" ? data.genre : data.genre.genre_id,
        actor_ids: [],
        director_ids: [],
      }
      putQuery(`api/plays/${Data.play_id}/`, Data).then(r => r ? (setLastSavedData(data), messageApi?.success("succesfully saved!", 0.5)) : messageApi?.error("error ocurred", 0.5))
    }
  }


  useEffect(() => {
    getQuery(`api/plays/${params.playid}`).then(e => {
      if (e) {
        setData(e as Play)
        setLastSavedData(e as Play)
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


  useEffect(() => {
    const note = refNote.current
    if (!note) return;
    scope.current = createScope({ root: refScope }).add(() => {
      createDraggable(note, {
        container: [0.9, 0, 0, 0],
        releaseEase: spring({ bounce: .1 }),
        containerFriction: 0.8
      });
    })

    return () => scope.current?.revert()
  }, [NodeIterator, data?.duration])

  // useEffect(() => SmoothButton(containerRef, buttonRef, () => (data != null && lastSavedData != null && !checkSame(data, lastSavedData))), [data])

  return <>
    <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate(-1)} />
    <Container renderItem="div" props={{ ref: refScope, style: { overflow: "hidden" } }} template="outer" containerSize="fullsize">
      <Container template="inner" containerSize="compact" props={{ style: { paddingTop: 16, position: "relative" } }}>
        {data?.duration == 0 && <div className="arrow-message fade-apear" ref={refNote} style={{ position: "absolute", right: 0, top: "210px" }}>
          <div style={{ position: "relative" }}>


            <div style={{ position: "absolute", right: 0, bottom: "0px", rotate: "20deg" }}>
              <Icon
                path={<g>
                  <path
                    d={arrow1_1}
                    strokeWidth={5}
                    stroke="currentColor"
                    className="arrow1" />
                  <path
                    d={arrow1_2}
                    strokeWidth={5}
                    stroke="currentColor"
                    className="arrow2" />
                </g>}
                style={{
                  width: 80,
                  color: colors.arrow,
                }}
                props={{
                  fill: "none",
                  viewBox: "0 0 100 100"
                }}
              />
            </div>
            <Container template="inner" containerSize="compact" props={{ style: { position: "absolute", backgroundColor: colors.arrow, left: -50, bottom: 50, padding: 16, minWidth: 160, rotate: "10deg" } }}>
              <Typography style={{ color: colors.primary }}>
                вистави не тривають 0 хв! 🙄 🕓
              </Typography>
            </Container>
          </div>
        </div>}

        {data && lastSavedData ? <>



          <FloatingContainer style={{
            left: undefined,
            right: 24,
            top: 12,
          }}>
            {!checkSame(data, lastSavedData) && <FloatingButton
              style={{
                fontSize: 24,
                color: colors["accent"] + "66",
              }}
              inContainer
              Icon={UndoOutlined}
              onClick={() => setData(lastSavedData)}
            />}
            <FloatingButton
              style={{
                fontSize: 24,
                color: colors["accent"] + "66",
              }}
              inContainer
              Icon={DeleteFilled}
              onClick={() => handleDelete(data.play_id)}
            />
          </FloatingContainer>
          {/* title */}
          <EditableField size="h1" textarea={{
            value: data.name,
            onChange: v => (changeField(v.currentTarget.value, "name", setData))
          }} />
          <Space ref={containerRef} direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space size={0} direction="vertical">
              <Space size="middle" style={{ alignItems: "start" }}>
                {/* name */}
                <Typography style={{ color: colors["primary-txt"] + "99" }}>
                  Автор:
                </Typography>
                <EditableField textarea={{
                  value: data.author,
                  onChange: v => (changeField(v.currentTarget.value, "author", setData)),
                }} />
                {/* duration */}
                <ClockCircleOutlined style={{
                  fontSize: 20,
                  color: colors["primary-txt"] + "99",
                }} />
                <EditableField size="fixed" textarea={{
                  value: duration2str(data.duration),
                  onChange: v => changeTime(v, setData),
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
              onChange: v => (changeField(v.currentTarget.value, "description", setData)),
            }} />

            {data != null && lastSavedData != null && !checkSame(data, lastSavedData) && <Space ref={buttonRef} style={{ width: "100%", justifyContent: "center" }}>
              <Button className="fade-apear" color="pink" variant="solid" shape="round" onClick={handleSave}>
                Зберегти
              </Button>
            </Space>}
          </Space>
        </> : null}
      </Container>
    </Container>

  </>
}

export default PlayPage;
