import type React from "react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuery, getQuery } from "../utils/RestUtils";
import { type Actor, type Director, type Genre, type Play } from "../utils/ApiDtos";
import { Button, Popover, Space, Tooltip, Typography, Upload } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { colors } from "../config";
import { DeleteFilled, FileImageFilled, LeftCircleFilled, UndoOutlined } from "@ant-design/icons";
import { changeField, checkSame } from "../utils/HookFolders";
import { Container } from "../components/Containers";
import { useInFirst, useMessage, usePlayState } from "../utils/StateManager";
import { FloatingContainer } from "../components/FloatingContainer";
import { PlayArrowMessageGeneralWarning } from "../components/PlayArrows";
import NameField from "../components/CRUDPlayPage/NameField";
import AuthorField from "../components/CRUDPlayPage/AuthorField";
import DurationField from "../components/CRUDPlayPage/DurationField";
import GenreField from "../components/CRUDPlayPage/GenreField";
import ActorsField from "../components/CRUDPlayPage/ActorsField";
import DirectosField from "../components/CRUDPlayPage/DirectosField";
import DescriptionField from "../components/CRUDPlayPage/DescriptionField";
import ActionButton from "../components/CRUDPlayPage/ActionButton";


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
  const setChecked = useInFirst((s) => s.setChecked);
  const navigate = useNavigate();

  const [filePopover, setFilePopover] = useState(false);


  const data = usePlayState(s => s.data)
  const lastSaved = usePlayState(s => s.savedData)
  const valid = usePlayState(s => s.isValid)
  const changed = usePlayState(s => s.isChanged)


  const setInitial = usePlayState(s => s.init)
  const undo = usePlayState(s => s.undo)

  const refScope = useRef<HTMLDivElement>(null);

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
        if (changed) {
          e.preventDefault()
          e.returnValue = ""
        }
      }
      window.addEventListener("beforeunload", handleBeforeUnload)
      return () => { window.removeEventListener("beforeunload", handleBeforeUnload) }
    }
  }, [data])


  useEffect(() => {
    setInitalData(params.playid).then((e) => {
      if (e) {
        setInitial(e);        
        
      } else {
        navigate("/error");
      }
    });
  }, [params.playid, navigate, setInitial]);

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
        <Tooltip title={tooltip && inFirst && <Typography style={{ color: colors.primary, cursor: "pointer" }} onClick={() => setChecked()}>ти можеш редагувати поля! спробуй!!!🤩 (натисни на мене, щоб я не відображався😢)</Typography>}>
          <div>
            <Container
              template="inner"
              containerSize="compact"
              props={{ style: { paddingTop: 16, position: "relative" } }}
            >
              {/* TODO */}
              {/* {data &&
                (!boolData.name || !boolData.genre || !boolData.description) && <PlayArrowMessageGeneralWarning refScope={refScope} message={correctnessWarningTxt} />} */}
              {data ? (
                <>
                  {/* TOP BAR BUTTONS (INSIDE THE CONTAINER/NEAR DELETE) */}
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
                          // onRemove={() => changeField(null, "image", setData)}
                          beforeUpload={() => false}
                          accept="image/**"
                          onChange={({ file }) => {
                            console.log(file);

                            if (file.status != "done" || !file || !file.originFileObj) return;
                            console.log(file);

                            const readFile = file.originFileObj as File;

                            // changeField(readFile, "image", setData)
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
                                // display: "none"
                              }}
                              props={{ className: "animated-icon-self-accent" }}
                            >
                            </FloatingButton>
                          </div>
                        </Tooltip>
                      </div>
                    </Popover>
                    {actions?.includes("undo") && (
                      <FloatingButton
                        style={{
                          fontSize: 24,
                          color: colors["primary-txt"] + "79",
                        }}
                        inContainer
                        Icon={UndoOutlined}
                        onClick={() => undo()}
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
                  <NameField />
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <Space size={0} direction="vertical">
                      <Space size="middle" style={{ alignItems: "start" }}>
                        <AuthorField refScope={refScope} />
                        <DurationField refScope={refScope} />
                      </Space>
                      {/* TODO */}
                      {/* <GenreField /> */}
                      <Space size={0} style={{ alignItems: "start" }}>
                        {/* TODO */}
                        {/* <ActorsField /> */}
                        {/* TODO */}
                        {/* <DirectosField /> */}
                      </Space>
                    </Space>
                    {/* TODO */}
                    {/* <DescriptionField /> */}
                    {/* TODO */}
                    {/* <ActionButton onClick={() => ""} text={saveBtn.text} /> */}

                    {/* TODO: REPLACE TO NORMAL */}
                    <Space>
                      <FloatingButton
                        style={{
                          fontSize: 24,
                          color: colors["primary-txt"] + "79",
                        }}
                        inContainer
                        Icon={DeleteFilled}
                        onClick={() => {
                          // TODO changeField(null, "image", setData)
                        }}
                        props={{ className: "animated-icon-self-accent" }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          // TODO
                          // setData((prev) => {
                          //   if (!prev) return prev;
                          //   return {
                          //     ...prev,
                          //     image: file,
                          //   };
                          // });
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
