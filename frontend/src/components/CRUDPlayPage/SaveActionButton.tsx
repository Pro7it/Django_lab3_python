import { HeartFilled, HeartOutlined } from "@ant-design/icons"
import { colors } from "../../config"
import { FloatingButton } from "../FloatingButton"
import { usePlayState } from "../../utils/StateManager"

const SaveActionButton = () => {
    const saved = usePlayState(s => s.data?.saved)
    const changeField = usePlayState(s=>s.changeFiled)

    const handleSave = () => {
        changeField("saved", !saved)
    }

    return <FloatingButton
        style={{
            fontSize: 24,
            color: colors["primary-txt"] + "79",
        }}
        inContainer
        Icon={saved ? HeartFilled : HeartOutlined}
        onClick={handleSave}
        props={{ className: "animated-icon-self-accent", style: { color: saved ? colors.accent : undefined } }}
    />
}

export default SaveActionButton