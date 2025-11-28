import { getQuery, putQuery } from "../utils/RestUtils";
import { useMessage } from "../utils/StateManager";
import CRUDPlayPage, { formPlayData } from "./CRUDPlayPage"


const PlayPage = () => {
    const messageApi = useMessage((s) => s.messageApi);

    return <>
        <CRUDPlayPage
            saveBtn={{
                text: "Зберегти зміни",
                action: (data, setLastSavedData) => {
                    if (!data) return;
                    const formData = formPlayData(data)
                    putQuery(`/api/plays/${data.play_id}/`, formData).then((r) =>
                        r
                            ? (setLastSavedData(data),
                                messageApi?.success("успішно збережено!", 0.5))
                            : messageApi?.error("щось пішло не так(", 0.5)
                    );
                },
            }}
            actions={["delete", "undo"]}
            setInitalData={(id) => getQuery(`api/plays/${id}`)}
        />
    </>
}

export default PlayPage