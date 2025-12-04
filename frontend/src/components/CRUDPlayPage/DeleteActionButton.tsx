import { Button, Popover } from "antd"
import { colors } from "../../config"
import { FloatingButton } from "../FloatingButton"
import { DeleteFilled } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { deleteQuery } from "../../utils/RestUtils"
import { useMessage, usePlayState } from "../../utils/StateManager"



const DeleteActionButton: React.FC<{ id?: number }> = ({ id }) => {
    const navigate = useNavigate();
    const messageApi = useMessage((s) => s.messageApi);
    const _id = usePlayState(s => s.data?.play_id)


    const handleDelete = (id: number) =>
        deleteQuery(`api/plays/${id}/`).then((r) =>
            r
                ? (messageApi?.success("видалено!", 1).then(() => navigate(-1)), null)
                : messageApi?.error("щось пішло не так(", 0.5)
        );

    return <Popover
        styles={{ body: { borderRadius: 16 } }}
        title="Реально видалиш?"
        trigger="click"
        content={<Button
            variant="filled"
            type="link"
            shape="round"
            color="red"
            style={{ backgroundColor: colors.primary }}
            onClick={() => handleDelete(id ?? _id ?? -1)}>
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
    </Popover>
}

export default DeleteActionButton