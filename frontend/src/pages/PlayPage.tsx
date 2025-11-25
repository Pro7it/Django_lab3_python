import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuery, getQuery, putFormData } from "../utils/RestUtils";
import {
  type Actor,
  type Director,
  type Genre,
  type Play,
} from "../utils/ApiDtos";
import { Button, Select, Space, Typography } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { colors } from "../config";
import {
  ClockCircleOutlined,
  DeleteFilled,
  LeftCircleFilled,
  UndoOutlined,
} from "@ant-design/icons";
import { changeField, changeTime, checkSame } from "../utils/HookFolders";
import EditableField from "../components/EditableField";
import { Container } from "../components/Containers";
import { useMessage } from "../utils/StateManager";
import { duration2str } from "../utils/DurationUtils";
import Icon from "../components/Icon";
import {
  arrow1_1,
  arrow1_2,
  arrow2_1,
  arrow2_2,
  arrow3_1,
  arrow3_2,
} from "../utils/IconPaths";
import { createDraggable, createScope, spring, Scope } from "animejs";
import { FloatingContainer } from "../components/FloatingContainer";

const PlayPage: React.FC = () => {
  const params = useParams<{ playid: string }>();
  const [data, setData] = useState<Play | null>(null);
  const [boolData, setBoolData] = useState<boolObj<Play>>({});
  const [lastSavedData, setLastSavedData] = useState<Play | null>(null);
  const messageApi = useMessage((s) => s.messageApi);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const navigate = useNavigate();
  const scope = useRef<Scope>(null);
  const refScope = useRef<HTMLDivElement>(null);
  const refNote1 = useRef<HTMLDivElement>(null);
  const refNote2 = useRef<HTMLDivElement>(null);
  const refNote3 = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [correctnessWarningTxt, setCorrectnessWarningTxt] =
    useState<string>("");

  const handleDelete = (id: number) =>
    deleteQuery(`api/plays/${id}/`).then((r) =>
      r
        ? (messageApi?.success("deleted!", 1).then(() => navigate(-1)), null)
        : messageApi?.error("error ocurred", 0.5)
    );

  // const handleSave = () => {
  //   if (data) {
  //     const Data = {
  //       ...data,
  //       genre_id:
  //         typeof data.genre === "number" ? data.genre : data.genre.genre_id,
  //       actor_ids:
  //         data.actors.length > 0 && typeof data.actors[0] != "number"
  //           ? data.actors.map((a) => (a as Actor).actor_id)
  //           : data.actors,
  //       director_ids:
  //         data.directors.length > 0 && typeof data.directors[0] != "number"
  //           ? data.directors.map((a) => (a as Director).director_id)
  //           : data.directors,
  //       // image: typeof data.image === "string" ? data.image : null,
  //     };
  // putQuery(`api/plays/${Data.play_id}/`, Data).then((r) =>
  //       r
  //         ? (setLastSavedData(data),
  //           messageApi?.success("succesfully saved!", 0.5))
  //         : messageApi?.error("error ocurred", 0.5)
  //     );
  //   }
  // };

  const handleSave = () => {
    if (!data) return;

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("author", data.author);
    formData.append("description", data.description);
    formData.append("duration", data.duration.toString());

    formData.append(
      "genre_id",
      typeof data.genre === "number"
        ? data.genre.toString()
        : data.genre.genre_id.toString()
    );

    const actor_ids =
      data.actors.length > 0 && typeof data.actors[0] !== "number"
        ? (data.actors as Actor[]).map((a) => a.actor_id)
        : (data.actors as number[]);

    actor_ids.forEach((id) => formData.append("actor_ids", id.toString()));

    const director_ids =
      data.directors.length > 0 && typeof data.directors[0] !== "number"
        ? (data.directors as Director[]).map((d) => d.director_id)
        : (data.directors as number[]);

    director_ids.forEach((id) =>
      formData.append("director_ids", id.toString())
    );

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    putFormData(`/api/plays/${data.play_id}/`, formData).then((r) =>
      r
        ? (setLastSavedData(data),
          messageApi?.success("succesfully saved!", 0.5))
        : messageApi?.error("error ocurred", 0.5)
    );
  };

  type boolObj<T> = {
    [K in keyof T]?: boolean;
  };

  const checkForCorectness = (data?: Play): boolObj<Play> => {
    if (!data) return {};

    return {
      name: data.name.trim() !== "",
      author: data.author.trim() !== "",
      description: data.description.trim() !== "",
      genre: data.genre != 0,
      duration: data.duration > 0,
    };
  };

  const getTextForCorrectnessWarning = (data?: Play) => {
    if (!data) return "";
    //TODO думаю залишу це на Олену, якщо вона захоче
    return "TODO";
  };

  const checkIfAllCorrect = (
    data: Play,
    lastSavedData: Play,
    boolData: boolObj<Play>
  ) => {
    if (checkSame(data, lastSavedData)) return false;
    if (!Object.keys(boolData).every((k) => boolData[k as keyof boolObj<Play>]))
      return false;

    return true;
  };

  useEffect(() => {
    getQuery(`api/plays/${params.playid}`).then((e) => {
      if (e) {
        setData(e as Play);
        setLastSavedData(e as Play);
        setBoolData(checkForCorectness(e as Play));
      } else {
        navigate("/error");
      }
    });

    getQuery(`api/genres`).then((e) => {
      if (e) setGenres(e as Genre[]);
    });
    getQuery(`api/actors`).then((e) => {
      if (e) setActors(e as Actor[]);
    });
    getQuery(`api/directors`).then((e) => {
      if (e) setDirectors(e as Director[]);
    });
  }, [params.playid, navigate]);

  useEffect(() => {
    if (data) {
      setBoolData(checkForCorectness(data));
      setCorrectnessWarningTxt(getTextForCorrectnessWarning(data));
    }
  }, [data]);

  useEffect(() => {
    const note = [refNote1.current, refNote2.current, refNote3.current];

    scope.current = createScope({ root: refScope }).add(() => {
      note.forEach((note) => {
        if (!note) return;
        createDraggable(note, {
          container: [0.9, 0, 0, 0],
          releaseEase: spring({ bounce: 0.1 }),
          containerFriction: 0.8,
        });
      });
    });

    return () => scope.current?.revert();
  }, [data, boolData]);

  // useEffect(() => SmoothButton(containerRef, buttonRef, () => (data != null && lastSavedData != null && !checkSame(data, lastSavedData))), [data])

  return (
    <>
      <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate(-1)} />
      <Container
        renderItem="div"
        props={{ ref: refScope, style: { overflow: "hidden" } }}
        template="outer"
        containerSize="fullsize"
      >
        <Container
          template="inner"
          containerSize="compact"
          props={{ style: { paddingTop: 16, position: "relative" } }}
        >
          {data &&
            (!boolData.name || !boolData.genre || !boolData.description) && (
              <div
                className="arrow-message fade-apear"
                ref={refNote3}
                style={{ position: "absolute", left: 250, top: 0, zIndex: 3 }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: "0px",
                      rotate: "25deg",
                    }}
                  >
                    <Icon
                      path={
                        <g>
                          <path
                            d={arrow3_1}
                            strokeWidth={5}
                            stroke="currentColor"
                            style={{
                              strokeWidth: "32px",
                              animationDuration: "2000ms",
                            }}
                            className="arrow1"
                          />
                          <path
                            d={arrow3_2}
                            strokeWidth={5}
                            stroke="currentColor"
                            style={{
                              animationDuration: "0ms",
                              animationDelay: "1900ms",
                              strokeWidth: "32px",
                            }}
                            className="arrow2"
                          />
                        </g>
                      }
                      style={{
                        width: 80,
                        color: colors.arrow,
                      }}
                      props={{
                        fill: "none",
                        viewBox: "0 0 512 512",
                      }}
                    />
                  </div>
                  <Container
                    template="inner"
                    containerSize="compact"
                    props={{
                      style: {
                        position: "absolute",
                        backgroundColor: colors.arrow,
                        left: -140,
                        bottom: 70,
                        padding: 16,
                        minWidth: 160,
                        rotate: "-5deg",
                      },
                    }}
                  >
                    <Typography style={{ color: colors.primary }}>
                      {correctnessWarningTxt}
                    </Typography>
                  </Container>
                </div>
              </div>
            )}

          {data && lastSavedData ? (
            <>
              <FloatingContainer
                style={{
                  left: undefined,
                  right: 24,
                  top: 12,
                }}
              >
                {!checkSame(data, lastSavedData) && (
                  <FloatingButton
                    style={{
                      fontSize: 24,
                      color: colors["primary-txt"] + "79",
                    }}
                    inContainer
                    Icon={UndoOutlined}
                    onClick={() => setData(lastSavedData)}
                    props={{ className: "animated-icon-self-accent" }}
                  />
                )}
                <FloatingButton
                  style={{
                    fontSize: 24,
                    color: colors["primary-txt"] + "79",
                  }}
                  inContainer
                  Icon={DeleteFilled}
                  onClick={() => handleDelete(data.play_id)}
                  props={{ className: "animated-icon-self-accent" }}
                />
              </FloatingContainer>

              {/* title */}
              <EditableField
                size="h1"
                textarea={{
                  ref: titleRef,
                  value: data.name,
                  onChange: (v) =>
                    changeField(v.currentTarget.value, "name", setData),
                }}
              />
              <Space
                ref={containerRef}
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Space size={0} direction="vertical">
                  <Space size="middle" style={{ alignItems: "start" }}>
                    {/* name */}
                    <Typography style={{ color: colors["primary-txt"] + "99" }}>
                      Автор:
                    </Typography>
                    <div
                      style={{
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <EditableField
                        textarea={{
                          value: data.author,
                          onChange: (v) =>
                            changeField(
                              v.currentTarget.value,
                              "author",
                              setData
                            ),
                        }}
                      />

                      {data && !boolData.author && (
                        <div
                          className="arrow-message fade-apear"
                          ref={refNote2}
                          style={{
                            position: "absolute",
                            left: -65,
                            top: 50,
                            zIndex: 3,
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                bottom: "0px",
                                rotate: "20deg",
                              }}
                            >
                              <Icon
                                path={
                                  <g>
                                    <path
                                      d={arrow2_2}
                                      strokeWidth={5}
                                      stroke="currentColor"
                                      style={{
                                        strokeWidth: "32px",
                                      }}
                                      className="arrow1"
                                    />
                                    <path
                                      d={arrow2_1}
                                      strokeWidth={5}
                                      stroke="currentColor"
                                      style={{
                                        animationDuration: "0ms",
                                        animationDelay: "3000ms",
                                        strokeWidth: "32px",
                                      }}
                                      className="arrow2"
                                    />
                                  </g>
                                }
                                style={{
                                  width: 80,
                                  color: colors.arrow,
                                }}
                                props={{
                                  fill: "none",
                                  viewBox: "0 0 512 512",
                                }}
                              />
                            </div>
                            <Container
                              template="inner"
                              containerSize="compact"
                              props={{
                                style: {
                                  position: "absolute",
                                  backgroundColor: colors.arrow,
                                  right: 20,
                                  bottom: 80,
                                  padding: 16,
                                  minWidth: 160,
                                  rotate: "10deg",
                                },
                              }}
                            >
                              <Typography style={{ color: colors.primary }}>
                                а хто автор цього шедевру? 🤔🤔🤔
                              </Typography>
                            </Container>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* duration */}

                    <ClockCircleOutlined
                      style={{
                        fontSize: 20,
                        color: colors["primary-txt"] + "99",
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <EditableField
                        size="fixed"
                        textarea={{
                          value: duration2str(data.duration),
                          onChange: (v) => changeTime(v, setData),
                        }}
                      />

                      {data && !boolData.duration && (
                        <div
                          className="arrow-message fade-apear"
                          ref={refNote1}
                          style={{
                            position: "absolute",
                            right: -45,
                            top: 80,
                            zIndex: 3,
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                bottom: "0px",
                                rotate: "20deg",
                              }}
                            >
                              <Icon
                                path={
                                  <g>
                                    <path
                                      d={arrow1_1}
                                      strokeWidth={5}
                                      stroke="currentColor"
                                      className="arrow1"
                                    />
                                    <path
                                      d={arrow1_2}
                                      strokeWidth={5}
                                      stroke="currentColor"
                                      className="arrow2"
                                    />
                                  </g>
                                }
                                style={{
                                  width: 80,
                                  color: colors.arrow,
                                }}
                                props={{
                                  fill: "none",
                                  viewBox: "0 0 100 100",
                                }}
                              />
                            </div>
                            <Container
                              template="inner"
                              containerSize="compact"
                              props={{
                                style: {
                                  position: "absolute",
                                  backgroundColor: colors.arrow,
                                  left: -50,
                                  bottom: 50,
                                  padding: 16,
                                  minWidth: 160,
                                  rotate: "10deg",
                                },
                              }}
                            >
                              <Typography style={{ color: colors.primary }}>
                                вистави не тривають 0 хв! 🙄 🕓
                              </Typography>
                            </Container>
                          </div>
                        </div>
                      )}
                    </div>
                  </Space>
                  <Space size={0}>
                    {/* Genre */}
                    <Typography style={{ color: colors["primary-txt"] + "99" }}>
                      Жанр:
                    </Typography>
                    <Select
                      className="select-edit"
                      suffixIcon={false}
                      popupMatchSelectWidth={false}
                      options={
                        genres
                          ? genres.map((genre) => ({
                              value: genre.genre_id,
                              label: <Typography>{genre.name}</Typography>,
                            }))
                          : [
                              typeof data.genre == "number"
                                ? {
                                    value: data.genre,
                                    label: (
                                      <Typography>{data.genre}</Typography>
                                    ),
                                  }
                                : {
                                    value: data.genre.genre_id,
                                    label: (
                                      <Typography>{data.genre.name}</Typography>
                                    ),
                                  },
                            ]
                      }
                      value={
                        typeof data.genre == "number"
                          ? data.genre
                          : data.genre.genre_id
                      }
                      onChange={(v) => {
                        if (typeof data.genre == "number") {
                          changeField(v, "genre", setData);
                        } else if (genres) {
                          changeField(
                            genres.filter((g) => g.genre_id == v)[0],
                            "genre",
                            setData
                          );
                        }
                      }}
                      variant="borderless"
                      style={{
                        width: "fit-content",
                        padding: 0,
                      }}
                    />
                  </Space>

                  <Space size={0} style={{ alignItems: "start" }}>
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
                      >
                        Актори:
                      </Typography>
                      <Select
                        popupMatchSelectWidth={false}
                        menuItemSelectedIcon={false}
                        showSearch={false}
                        suffixIcon={null}
                        variant="borderless"
                        mode="multiple"
                        placeholder="тут актори"
                        options={actors.map((a) => ({
                          value: a.actor_id,
                          label: (
                            <Typography style={{ width: "max-content" }}>
                              {a.name}
                            </Typography>
                          ),
                        }))}
                        value={
                          data.actors.length > 0
                            ? typeof data.actors[0] == "number"
                              ? (data.actors as number[])
                              : data.actors.map((a) => (a as Actor).actor_id)
                            : []
                        }
                        onChange={(ids) => {
                          if (
                            data.actors.length > 0 &&
                            typeof data.actors[0] == "number"
                          ) {
                            changeField(ids, "actors", setData);
                          } else {
                            changeField(
                              actors.filter(
                                (a) => !ids.every((id) => id != a.actor_id)
                              ),
                              "actors",
                              setData
                            );
                          }
                        }}
                        style={{
                          width: 200,
                          padding: 0,
                        }}
                        styles={{ popup: { root: { width: "fit-content" } } }}
                      />
                    </div>

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
                      >
                        Продюсери:
                      </Typography>
                      <Select
                        popupMatchSelectWidth={false}
                        menuItemSelectedIcon={false}
                        showSearch={false}
                        suffixIcon={null}
                        variant="borderless"
                        mode="multiple"
                        placeholder="я продюсер"
                        options={directors.map((d) => ({
                          value: d.director_id,
                          label: (
                            <Typography style={{ width: "max-content" }}>
                              {d.name}
                            </Typography>
                          ),
                        }))}
                        value={
                          data.directors.length > 0
                            ? typeof data.directors[0] == "number"
                              ? (data.directors as number[])
                              : data.directors.map(
                                  (a) => (a as Director).director_id
                                )
                            : []
                        }
                        onChange={(ids: number[]) => {
                          if (
                            data.directors.length > 0 &&
                            typeof data.directors[0] == "number"
                          ) {
                            changeField(ids, "directors", setData);
                          } else {
                            changeField(
                              directors.filter(
                                (a) => !ids.every((id) => id != a.director_id)
                              ),
                              "directors",
                              setData
                            );
                          }
                        }}
                        style={{
                          width: 200,
                          padding: 0,
                        }}
                        styles={{ popup: { root: { width: "fit-content" } } }}
                      />
                    </div>
                  </Space>
                </Space>
                <EditableField
                  textarea={{
                    value: data.description,
                    onChange: (v) =>
                      changeField(
                        v.currentTarget.value,
                        "description",
                        setData
                      ),
                  }}
                />

                {data &&
                  boolData &&
                  checkIfAllCorrect(data, lastSavedData, boolData) && (
                    <Space
                      ref={buttonRef}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      <Button
                        className="fade-apear"
                        color="pink"
                        variant="solid"
                        shape="round"
                        onClick={handleSave}
                      >
                        Зберегти
                      </Button>
                    </Space>
                  )}

                {data.image ? (
                  <>
                    {/* TODO: зробити фотографію на задньому фоні, та додати кнопку видалення фотографії */}
                    <img
                      src={`http://localhost:8000/${data.image}`}
                      alt={data.name}
                      style={{ maxWidth: 300, borderRadius: 8 }}
                    />
                    <Typography style={{ color: colors["primary-txt"] }}>
                      {" "}
                      Картинку можна побачити на фоні
                    </Typography>
                  </>
                ) : (
                  <Typography style={{ color: colors["primary-txt"] }}>
                    Картинка відсутня
                  </Typography>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setData((prev) => {
                      if (!prev) return prev;

                      return {
                        ...prev,
                        image: file,
                      };
                    });
                  }}
                />
              </Space>
            </>
          ) : null}
        </Container>
      </Container>
    </>
  );
};

export default PlayPage;
