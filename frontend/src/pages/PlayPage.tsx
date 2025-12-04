import { useNavigate, useParams } from "react-router-dom";
import { getQuery, putQuery } from "../utils/RestUtils";
import { useMessage, usePlayState } from "../utils/StateManager";
import CRUDPlayPage from "./CRUDPlayPage"
import type { Play } from "../utils/ApiDtos";
import { useEffect } from "react";
import { formPlayData } from "../utils/FormPlayData";


const PlayPage = () => {
    const messageApi = useMessage((s) => s.messageApi);
    const data = usePlayState(s => s.data)
    const save = usePlayState(s => s.save)
    const navigate = useNavigate();
    const setInitial = usePlayState(s => s.init)
    const params = useParams<{ playid: string }>();


    useEffect(() => {
        if (params.playid == undefined) return;

        getQuery(`api/plays/${params.playid}`).then((e) => {
            if (e) {
                setInitial(e as Play);
            } else {
                navigate("/error");
            }
        })

    }, [params.playid])

    return <>
        <CRUDPlayPage
            saveBtn={{
                text: "Зберегти зміни",
                action: () => {
                    if (!data) return;
                    const formData = formPlayData(data)
                    putQuery(`/api/plays/${data.play_id}/`, formData).then((r) => r ? (save(), messageApi?.success("успішно збережено!", 0.5)) : messageApi?.error("щось пішло не так(", 0.5)
                    );
                },
            }}
            actions={["delete", "undo"]}
        />
    </>
}

export default PlayPage