import { UndoOutlined } from "@ant-design/icons"
import { colors } from "../../config"
import { usePlayState } from "../../utils/StateManager"
import { FloatingButton } from "../FloatingButton"

const UndoActionButton = () => {
    const changed = usePlayState(s => s.isChanged)
    const undo = usePlayState(s => s.undo)


    return changed && <FloatingButton
        style={{
            fontSize: 24,
            color: colors["primary-txt"] + "79",
        }}
        inContainer
        Icon={UndoOutlined}
        onClick={() => undo()}
        props={{ className: "animated-icon-self-accent" }}
    />
}

export default UndoActionButton