import type React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Space } from "antd";
import { FloatingButton } from "../components/FloatingButton";
import { LeftCircleFilled } from "@ant-design/icons";
import { Container } from "../components/Containers";
import { usePlayState } from "../utils/StateManager";
import { FloatingContainer } from "../components/FloatingContainer";
import { PlayArrowMessageGeneralWarning } from "../components/CRUDPlayPage/PlayArrows";
import NameField from "../components/CRUDPlayPage/NameField";
import AuthorField from "../components/CRUDPlayPage/AuthorField";
import DurationField from "../components/CRUDPlayPage/DurationField";
import GenreField from "../components/CRUDPlayPage/GenreField";
import ActorsField from "../components/CRUDPlayPage/ActorsField";
import DirectosField from "../components/CRUDPlayPage/DirectosField";
import DescriptionField from "../components/CRUDPlayPage/DescriptionField";
import ActionButton from "../components/CRUDPlayPage/ActionButton";
import UploadImage from "../components/CRUDPlayPage/UploadImage";
import DeleteActionButton from "../components/CRUDPlayPage/DeleteActionButton";
import UndoActionButton from "../components/CRUDPlayPage/UndoActionButton";
import ImageBgContainer from "../components/CRUDPlayPage/ImageBgContainer";
import HelperMessage from "../components/CRUDPlayPage/HelperMessage";


type CRUDPageActionsT = "delete" | "undo"

interface CRUDPageProps {
  // кнопка яка появляється, при зміні даних, якщо вони відповідають правилам валідації
  saveBtn: {
    text: string,
    action: () => any
  },
  // кнопки доступних дій (згори)
  actions?: CRUDPageActionsT[],
  tooltip?: boolean,
  warnUnsaved?: boolean,
}

const CRUDPlayPage: React.FC<CRUDPageProps> = ({
  saveBtn,
  actions,
  tooltip = true,
  warnUnsaved = true,
}) => {
  const navigate = useNavigate();
  const refScope = useRef<HTMLDivElement>(null);
  const data = usePlayState(s => s.data)
  const valid = usePlayState(s => s.isValid)
  const changed = usePlayState(s => s.isChanged)

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


  return (
    <>
      <FloatingButton Icon={LeftCircleFilled} onClick={() => navigate(-1)} />
      <ImageBgContainer refScope={refScope}>
        <HelperMessage active={tooltip}>

          <Container template="inner" props={{ style: { paddingTop: 16, position: "relative" } }} >
            <PlayArrowMessageGeneralWarning refScope={refScope} />

            <FloatingContainer style={{ left: undefined, right: 24, top: 12, }} >
              <UploadImage />
              {actions?.includes("undo") && <UndoActionButton />}
              {actions?.includes("delete") && <DeleteActionButton />}
            </FloatingContainer>

            <NameField />
            <Space direction="vertical" size="middle" style={{ width: "100%", justifyContent: "start" }} >
              <div className="grid-auto" >
                <AuthorField refScope={refScope} />
                <DurationField refScope={refScope} />
                <GenreField />
                <div />
                <ActorsField />
                <DirectosField />
              </div>
              <DescriptionField />
              <ActionButton active={changed && !valid} onClick={saveBtn.action} text={saveBtn.text} />
            </Space>
          </Container>

        </HelperMessage>
      </ImageBgContainer >
    </>
  );
};

export default CRUDPlayPage;
