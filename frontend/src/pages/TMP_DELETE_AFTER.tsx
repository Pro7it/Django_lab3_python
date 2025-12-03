import type React from "react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuery, getQuery } from "../utils/RestUtils";
import { type Actor, type Director, type Genre, type Play } from "../utils/ApiDtos";
import { Button, Popover, Select, Space, Tooltip, Typography, Upload } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { colors } from "../config";
import { ClockCircleOutlined, DeleteFilled, FileImageFilled, LeftCircleFilled, UndoOutlined } from "@ant-design/icons";
import { changeField, changeTime, checkSame } from "../utils/HookFolders";
import EditableField from "../components/EditableField";
import { Container } from "../components/Containers";
import { useInFirst, useMessage } from "../utils/StateManager";
import { duration2str } from "../utils/DurationUtils";
import Icon from "../components/Icon";
import { arrow1_1, arrow1_2, arrow2_1, arrow2_2, arrow3_1, arrow3_2 } from "../utils/IconPaths";
import { createDraggable, createScope, spring, Scope } from "animejs";
import { FloatingContainer } from "../components/FloatingContainer";


//? independent features >>>>
const objA2numA = <T,>(arr: T[] | number[], idField: string): number[] => {
  if (arr.length > 0 && typeof arr[0] !== "number")
    return arr.map((o) => (o as T)[idField as keyof T] as number);
  return arr as number[];
};

type boolObj<T> = {
  [K in keyof T]?: boolean;
};

const checkValidation = <T,>(boolData: boolObj<T>) => Object.keys(boolData).every((k) => boolData[k as keyof boolObj<T>])

type CRUDPageActionsT = "delete" | "undo"

interface CRUDPageProps<T> {
  // кнопка яка появляється, при зміні даних, якщо вони відповідають правилам валідації
  saveBtn: {
    text: string,
    action: (data: T | null, setLastSavedData: React.Dispatch<React.SetStateAction<T | null>>, setData: React.Dispatch<React.SetStateAction<T | null>>) => any
  },
  // кнопки доступних дій (згори)
  actions?: CRUDPageActionsT[],
  setInitalData: (id?: string) => Promise<T | null>,
  tooltip?: boolean,
  warnUnsaved?: boolean,
}




//? dependent from play features >>>>
export const formPlayData = (data: Play): FormData => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("author", data.author);
  formData.append("description", data.description);
  formData.append("duration", data.duration.toString());

  objA2numA([data.genre], "genre_id").map((g) =>
    formData.append("genre_id", g.toString())
  );

  objA2numA(data.actors, "actor_id").forEach((id) =>
    formData.append("actor_ids", id.toString())
  );
  objA2numA(data.directors, "director_id").forEach((id) =>
    formData.append("director_ids", id.toString())
  );

  if (data.image instanceof File) {
    // if (data.image != null) {
    formData.append("image_file", data.image);
  } else if (typeof data.image === "string") {
    formData.append("image_url", data.image);
  } else {
    formData.append("image_url", "");
  }

  return formData
}




const CRUDPlayPage: React.FC<CRUDPageProps<Play>> = ({
  saveBtn,
  actions,
  setInitalData,
  tooltip = true,
  warnUnsaved = true,
}) => {
  const params = useParams<{ playid: string }>();
  const messageApi = useMessage((s) => s.messageApi);
  const inFirst = useInFirst((s) => s.inFirst);
  const setInFirst = useInFirst((s) => s.setInFirst);
  const navigate = useNavigate();

  const [data, setData] = useState<Play | null>(null);
  const [boolData, setBoolData] = useState<boolObj<Play>>({});
  const [lastSavedData, setLastSavedData] = useState<Play | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [correctnessWarningTxt, setCorrectnessWarningTxt] = useState<ReactNode | string>("");
  const [filePopover, setFilePopover] = useState(false);

  const scope = useRef<Scope>(null);
  const refScope = useRef<HTMLDivElement>(null);
  const refNote1 = useRef<HTMLDivElement>(null);
  const refNote2 = useRef<HTMLDivElement>(null);
  const refNote3 = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: number) =>
    deleteQuery(`api/plays/${id}/`).then((r) =>
      r
        ? (messageApi?.success("видалено!", 1).then(() => navigate(-1)), null)
        : messageApi?.error("щось пішло не так(", 0.5)
    );


  const play2validationObj = (data?: Play): boolObj<Play> => {
    if (!data) return {};

    return {
      name: data.name.trim() !== "",
      author: data.author.trim() !== "",
      description: data.description.trim() !== "",
      genre: data.genre != 0,
      duration: data.duration > 0,
    };
  };


  const getTextForCorrectnessWarning = (boolData?: boolObj<Play>) => {
    if (!boolData) return <></>;

    return <>
      {!boolData.name && <Typography style={{ color: colors.primary }}>
        А де назва? еееей!!? 🤬
      </Typography>}
      {!boolData.description && <Typography style={{ color: colors.primary }}>
        ти бачив? там в низу опис є...
      </Typography>}
      {!boolData.genre && <Typography style={{ color: colors.primary }}>
        кстаті вистав жанр мають щавжди😊😊
      </Typography>}
    </>
  };

  useEffect(() => {
    if (warnUnsaved) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (data && lastSavedData && !checkSame(data, lastSavedData)) {
          e.preventDefault()
          e.returnValue = ""
        }
      }
      window.addEventListener("beforeunload", handleBeforeUnload)
      return () => { window.removeEventListener("beforeunload", handleBeforeUnload) }
    }
  }, [data])


  //стягує плей та потрібні для неї поля з foreign key constraint
  useEffect(() => {
    setInitalData(params.playid).then((e) => {
      if (e) {
        setData(e);
        setLastSavedData(e);
        setBoolData(play2validationObj(e));
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
    if (data)
      setBoolData(play2validationObj(data));
  }, [data]);

  useEffect(() => {
    if (data)
      setCorrectnessWarningTxt(getTextForCorrectnessWarning(boolData));
  }, [boolData]);

  //анімації стрілок
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

  return (
    <>
      <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate(-1)} />
      <Container
        renderItem="div"
        props={{
          ref: refScope,
          style: {
            overflow: "hidden",
            // backgroundImage: data?.image ? `url(${data.image})` : undefined,
            backgroundImage: data?.image
              ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(http://localhost:8000/${data.image})`
              : undefined,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
        }}
        template="outer"
        containerSize="fullsize"
      >
        <Tooltip title={tooltip && inFirst && <Typography style={{ color: colors.primary, cursor: "pointer" }} onClick={() => setInFirst(false)}>ти можеш редагувати поля! спробуй!!!🤩 (натисни на мене, щоб я не відображався😢)</Typography>}>
          <div>
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
                            width: "max-content",
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
                    <Popover
                      open={filePopover}
                      onOpenChange={(v) => setFilePopover(v)}
                      styles={{ body: { borderRadius: 16 } }}
                      trigger="click"
                      content={<Space direction="vertical" size="small">
                        <Upload

                          maxCount={1}
                          disabled={(data.image != "" && data.image != null)}
                          onRemove={() => changeField(null, "image", setData)}
                          beforeUpload={() => false}
                          accept="image/**"
                          onChange={({ file }) => {
                            console.log(file);

                            if (file.status != "done" || !file || !file.originFileObj) return;
                            console.log(file);

                            const readFile = file.originFileObj as File;

                            changeField(readFile, "image", setData)
                            console.log(data);

                          }}
                        >
                          <Button
                            style={{ backgroundColor: colors.primary }}
                            variant="filled"
                            type="link"
                            shape="round"
                            color="pink">
                            додати фото
                          </Button>
                        </Upload>
                      </Space>}><div>

                        <Tooltip open={filePopover ? false : undefined} trigger={"hover"} title={<Typography style={{ color: colors.primary, cursor: "default" }}>дії з фото</Typography>}>
                          <div>
                            <FloatingButton
                              inContainer
                              Icon={FileImageFilled}
                              onClick={() => { }}
                              style={{
                                fontSize: 24,
                                color: colors["primary-txt"] + "79",
                                display: "none"
                              }}
                              props={{ className: "animated-icon-self-accent" }}
                            >
                            </FloatingButton>
                          </div>
                        </Tooltip>
                      </div>
                    </Popover>
                    {actions?.includes("undo") && !checkSame(data, lastSavedData) && (
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
                    {actions?.includes("delete") &&
                      <Popover
                        styles={{ body: { borderRadius: 16 } }}
                        title="Реально видалиш?"
                        trigger="click"
                        content={<Button
                          variant="filled"
                          type="link"
                          shape="round"
                          color="red"
                          style={{ backgroundColor: colors.primary }}
                          onClick={() => handleDelete(data.play_id)}>
                          так я тверезий
                        </Button>}>
                        <div>
                          <FloatingButton
                            style={{
                              fontSize: 24,
                              color: colors["primary-txt"] + "79",
                            }}
                            inContainer
                            Icon={DeleteFilled}
                            onClick={() => { }}
                            props={{ className: "animated-icon-self-accent" }}
                          />
                        </div>
                      </Popover>}
                  </FloatingContainer>
                  {/* title */}
                  <EditableField
                    size="h1"
                    textarea={{
                      placeholder: "Назва шедевру",
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
                          }}>
                          <EditableField
                            textarea={{
                              placeholder: "Автор є?",
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
                          placeholder="тикни тут"
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
                            placeholder="тикни тут"
                            popupMatchSelectWidth={false}
                            menuItemSelectedIcon={false}
                            showSearch={false}
                            suffixIcon={null}
                            variant="borderless"
                            mode="multiple"
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
                            placeholder="тикни тут"
                            popupMatchSelectWidth={false}
                            menuItemSelectedIcon={false}
                            showSearch={false}
                            suffixIcon={null}
                            variant="borderless"
                            mode="multiple"
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
                    {/* ОПИС */}
                    <EditableField
                      textarea={{
                        placeholder: "хмм.. А про що це?",
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
                      !checkSame(data, lastSavedData) &&
                      checkValidation(boolData) && (
                        <Space
                          ref={buttonRef}
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          <Button
                            className="fade-apear"
                            color="pink"
                            variant="solid"
                            shape="round"
                            onClick={() => saveBtn.action(data, setLastSavedData, setData)}
                          >
                            {saveBtn.text}
                          </Button>
                        </Space>
                      )}
                    <Space>
                      <FloatingButton
                        style={{
                          fontSize: 24,
                          color: colors["primary-txt"] + "79",
                        }}
                        inContainer
                        Icon={DeleteFilled}
                        onClick={() => changeField(null, "image", setData)}
                        props={{ className: "animated-icon-self-accent" }}
                      />
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
                  </Space>
                </>
              ) : null}
            </Container>
          </div>
        </Tooltip>
      </Container >
    </>
  );
};

export default CRUDPlayPage;
